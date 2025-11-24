// backend/routes/portalRoutes.js

const express = require("express");
const router = express.Router();
const { protect, ownerOnly } = require("../authMiddleware"); // Impor middleware
const RentRecord = require("../models/RentRecord");

// Import Models
const Room = require("../models/Room");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { generateChatResponse } = require("../controllers/aiController");

// ===== Helpers for Rent Records =====
async function ensureRentRecordForMonth({ tenantId, room, baseDate }) {
  if (!room) return null;

  const year = baseDate.getFullYear();
  const monthNumber = baseDate.getMonth(); // 0-11

  const monthKey = `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

  // Example: due on 5th of that month
  const dueDate = new Date(year, monthNumber, 5);

  const record = await RentRecord.findOneAndUpdate(
    { tenant: tenantId, room: room._id, month: monthKey },
    {
      $setOnInsert: {
        amount: room.rent_amount || 0,
        dueDate,
        status: "Pending",
      },
    },
    { upsert: true, new: true }
  ).populate("room", "room_number rent_amount");

  return record;
}

// ===================================
// TENANT & ROOM DATA (GENERAL ACCESS)
// ===================================

// @route GET /api/portal/me
// @desc Get current user's profile data (Tenant or Owner)
router.get("/me", protect, async (req, res) => {
  try {
    // Find user by ID attached by the 'protect' middleware
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("room");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching user data.");
  }
});

// 🛑 NEW ROUTE: PROFILE UPDATE FOR TENANT/OWNER (EDIT PROFILE BUTTON)
// @route PUT /api/portal/me
// @desc Update current user's profile (name, phone)
router.put("/me", protect, async (req, res) => {
  const { name, phone } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Apply updates
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    // Return the updated user object (excluding the password)
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      room: user.room,
      role: user.role,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during profile update.");
  }
});


// ===== Mark all overdue rent records globally (for Owner summary) =====
async function updateAllOverdueRentRecords() {
  const today = new Date();

  await RentRecord.updateMany(
    {
      status: "Pending",
      dueDate: { $lt: today },
    },
    {
      status: "Overdue",
    }
  );
}



async function updateOverdueRecordsForTenant(tenantId) {
  const today = new Date();

  await RentRecord.updateMany(
    {
      tenant: tenantId,
      status: "Pending",
      dueDate: { $lt: today }, // due date passed
    },
    {
      status: "Overdue",
    }
  );
}



// @route POST /api/portal/rent/reminder-text
// @desc Get AI-generated rent reminder sentence for the logged-in tenant
// @access Tenant (protect)
router.post("/rent/reminder-text", protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, dueDate, daysLeft } = req.body;

    if (typeof amount !== "number" || isNaN(amount)) {
      return res.status(400).json({ msg: "Valid amount is required" });
    }
    if (typeof daysLeft !== "number" || isNaN(daysLeft)) {
      return res.status(400).json({ msg: "Valid daysLeft is required" });
    }
    if (!dueDate) {
      return res.status(400).json({ msg: "dueDate is required" });
    }

    // Build a clear prompt for AI
    const prompt = `
You are a polite assistant for a PG (paying guest) management platform.

Write ONE short notification sentence (1 line), without emojis, to show on the tenant's dashboard as a rent reminder.

Context:
- Monthly rent amount: ₹${amount}
- Due date (as shown to tenant): ${dueDate}
- daysLeft (today to due date): ${daysLeft}

Rules:
- If daysLeft > 0: remind that rent is due in a few days.
- If daysLeft === 0: say rent is due today.
- If daysLeft < 0: say rent is overdue by some days.
- Be polite and professional.
- Do NOT mention "daysLeft" directly, just use natural language.
- Return ONLY the final sentence, no extra explanation.
    `.trim();

    const aiText = await generateChatResponse(prompt, userId);

    res.status(200).json({ text: aiText });
  } catch (err) {
    console.error("Rent reminder AI error:", err.message);
    res.status(500).json({ msg: "Failed to generate reminder text" });
  }
});




// @route PUT /api/portal/rent/pay
// @desc Mark a rent record as Paid (Tenant Only)
router.put("/rent/pay", protect, async (req, res) => {
  const { rentRecordId } = req.body;
  const userId = req.user.userId;

  if (!rentRecordId) {
    return res.status(400).json({ msg: "rentRecordId is required" });
  }

  try {
    const record = await RentRecord.findById(rentRecordId).populate(
      "room",
      "room_number rent_amount"
    );
    if (!record) {
      return res.status(404).json({ msg: "Rent record not found" });
    }

    // Safety: tenant can pay only their own record
    if (record.tenant.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ msg: "Not allowed to pay this rent record" });
    }

    record.status = "Paid";
    record.paidAt = new Date();
    await record.save();

    res.status(200).json({ msg: "Payment recorded", record });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error recording payment." });
  }
});

// @route GET /api/portal/rent/history
// @desc Get rent history for the logged-in tenant and auto-generate months
router.get("/rent/history", protect, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user with room info
    const user = await User.findById(userId).populate(
      "room",
      "room_number rent_amount"
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const room = user.room;
    let records = [];

    if (room) {
      const today = new Date();

      // previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      // current month
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      // next month
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      const createdOrExisting = await Promise.all([
        ensureRentRecordForMonth({
          tenantId: userId,
          room,
          baseDate: prevMonth,
        }),
        ensureRentRecordForMonth({
          tenantId: userId,
          room,
          baseDate: currentMonth,
        }),
        ensureRentRecordForMonth({
          tenantId: userId,
          room,
          baseDate: nextMonth,
        }),
      ]);

      // Fetch all records for this tenant so we return clean sorted list

      await updateOverdueRecordsForTenant(userId);

      records = await RentRecord.find({ tenant: userId })
        .populate("room", "room_number rent_amount")
        .sort({ dueDate: -1 });
    } else {
      // Tenant has no room yet → no records
      records = [];
    }

    res.status(200).json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error fetching rent history." });
  }
});

// @route GET /api/portal/tenant-list (Owner only)
// @desc Get list of all tenants with latest rent status
router.get("/tenant-list", protect, ownerOnly, async (req, res) => {
  try {
    const tenants = await User.find({ role: "tenant", is_active: true })
      .select("-password -__v -is_active")
      .populate("room", "room_number rent_amount");

    const tenantIds = tenants.map((t) => t._id);

    // Fetch all rent records for these tenants, newest dueDate first
    const rentRecords = await RentRecord.find({
      tenant: { $in: tenantIds },
    }).sort({ dueDate: -1 });

    // Map: tenantId -> latest rent record
    const latestRentByTenant = new Map();
    for (const rec of rentRecords) {
      const key = rec.tenant.toString();
      if (!latestRentByTenant.has(key)) {
        latestRentByTenant.set(key, rec);
      }
    }

    const formattedTenants = tenants.map((t) => {
      const key = t._id.toString();
      const latestRent = latestRentByTenant.get(key);

      return {
        id: t._id,
        name: t.name,
        email: t.email,
        phone: t.phone || "N/A",
        room: t.room ? t.room.room_number : "N/A",
        rentAmount: t.room ? t.room.rent_amount : 0,
        joinDate: t.createdAt.toLocaleDateString(),
        rentStatus: latestRent ? latestRent.status : "Pending",
        dueDate: latestRent
          ? new Date(latestRent.dueDate).toLocaleDateString()
          : "N/A",
      };
    });

    res.status(200).json(formattedTenants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching tenant list.");
  }
});


// @route GET /api/portal/rent/summary
// @desc Get global rent summary for owner (paid, pending, overdue totals)
// @access Owner only
router.get("/rent/summary", protect, ownerOnly, async (req, res) => {
  try {
    // First, normalize statuses based on dueDate
    await updateAllOverdueRentRecords();

    // Group sums by status
    const agg = await RentRecord.aggregate([
      {
        $group: {
          _id: "$status",      // "Paid", "Pending", "Overdue"
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totals = {
      Paid: 0,
      Pending: 0,
      Overdue: 0,
    };

    for (const row of agg) {
      if (totals[row._id] !== undefined) {
        totals[row._id] = row.total;
      }
    }

    res.status(200).json({
      totals, // { Paid, Pending, Overdue }
      outstanding: totals.Pending + totals.Overdue,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error generating rent summary." });
  }
});



// @route POST /api/portal/chat
// @desc Send message to AI assistant
router.post("/chat", protect, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    const aiResponse = await generateChatResponse(message, userId);
    res.json({ text: aiResponse });
  } catch (err) {
    console.error("Chat Route Error:", err.message);
    res
      .status(500)
      .json({ text: "Server error. Could not process chat request." });
  }
});

// @route DELETE /api/portal/tenants/:id
// @desc Delete a tenant and frees up the room (Owner Only)
router.delete("/tenants/:id", protect, ownerOnly, async (req, res) => {
  try {
    const tenantId = req.params.id;
    const tenant = await User.findById(tenantId);

    if (!tenant || tenant.role !== "tenant") {
      return res.status(404).json({ msg: "Tenant not found." });
    }

    // 1. Clear the tenant reference from the associated room (if any)
    if (tenant.room) {
      await Room.findByIdAndUpdate(tenant.room, {
        current_tenant: null,
        status: "Vacant",
      });
    }

    // 2. Delete the user (tenant)
    await User.deleteOne({ _id: tenantId });

    res.status(200).json({ msg: "Tenant deleted successfully" });
  } catch (err) {
    console.error("DELETE TENANT ERROR:", err.message);
    res
      .status(500)
      .send("Server Error: Database operation failed during deletion.");
  }
});

// ===================================
// ROOM MANAGEMENT (OWNER ONLY)
// ===================================

// @route POST /api/portal/rooms - Add a new room
router.post("/rooms", protect, ownerOnly, async (req, res) => {
  const { room_number, type, rent_amount, capacity } = req.body;

  try {
    const newRoom = new Room({ room_number, type, rent_amount, capacity });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Room number already exists" });
    }
    console.error(err.message);
    res.status(500).send("Server Error creating room.");
  }
});

// @route GET /api/portal/rooms - Get all rooms (Owner Dashboard)
router.get("/rooms/all", protect, ownerOnly, async (req, res) => {
  try {
    const rooms = await Room.find().populate("current_tenant", "name email");
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching rooms.");
  }
});

// 🛑 NEW ROUTE: ASSIGN/UNASSIGN ROOM
// @route PUT /api/portal/rooms/:id/assign
// @desc Assign or unassign a tenant to a room
router.put("/rooms/:id/assign", protect, ownerOnly, async (req, res) => {
  const { tenantId, action } = req.body; // action: 'assign' or 'unassign'

  try {
    const room = await Room.findById(req.params.id);
    const user = await User.findById(tenantId);

    if (!room || (action === "assign" && !user)) {
      return res.status(404).json({ msg: "Room or Tenant not found" });
    }

    if (action === "assign" && user.role !== "tenant") {
      return res
        .status(400)
        .json({ msg: "Only a tenant can be assigned to a room" });
    }

    if (action === "assign") {
      room.current_tenant = tenantId;
      room.status = "Occupied";
      user.room = room._id;

      // ===== Create or ensure current month's rent record exists =====
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + 5); // due 5 days from now, adjust as you like

      const monthKey = `${baseDate.getFullYear()}-${String(
        baseDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const dueDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 5); // due on 5th of that month

      // Upsert: if record exists for same tenant+room+month, don't create duplicate
      await RentRecord.findOneAndUpdate(
        { tenant: tenantId, room: room._id, month: monthKey },
        {
          $setOnInsert: {
            amount: room.rent_amount,
            dueDate,
            status: "Pending",
          },
        },
        { upsert: true, new: true }
      );
    } else if (action === "unassign") {
      room.current_tenant = null;
      room.status = "Vacant";
      user.room = null;
    } else {
      return res.status(400).json({ msg: "Invalid action specified" });
    }

    await Promise.all([room.save(), user.save()]);

    res.status(200).json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during room assignment.");
  }
});

// ===================================
// COMPLAINTS MANAGEMENT
// ===================================

// @route POST /api/portal/complaints - Submit a new complaint (Tenant)
router.post("/complaints", protect, async (req, res) => {
  const { room, issue, description } = req.body;
  const tenantId = req.user.userId;

  try {
    const newComplaint = new Complaint({
      tenant: tenantId,
      room,
      issue,
      description,
      status: "Pending", // initial status
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error submitting complaint.");
  }
});

// @route GET /api/portal/complaints/me - Get tenant's complaints (Tenant)
router.get("/complaints/me", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ tenant: req.user.userId })
      .populate("room", "room_number")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching tenant complaints.");
  }
});

// @route GET /api/portal/complaints - Get all complaints (Owner only)
router.get("/complaints", protect, ownerOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("tenant", "name email")
      .populate("room", "room_number")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error fetching all complaints.");
  }
});

// @route PUT /api/portal/complaints/:id/status - Update complaint status (Owner only)
router.put("/complaints/:id/status", protect, ownerOnly, async (req, res) => {
  const { status, resolution_details } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    complaint.status = status || complaint.status; // e.g. 'Resolved'
    complaint.resolution_details =
      resolution_details || complaint.resolution_details;

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error updating complaint status.");
  }
});

// @route DELETE /api/portal/complaints/:id - Tenant deletes own complaint
router.delete("/complaints/:id", protect, async (req, res) => {
  const complaintId = req.params.id;
  const userId = req.user.userId;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // Only the tenant who created it can delete it
    if (complaint.tenant.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not allowed to delete this complaint" });
    }

    await Complaint.findByIdAndDelete(complaintId);
    res.status(200).json({ msg: "Complaint deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error deleting complaint.");
  }
});

module.exports = router;
