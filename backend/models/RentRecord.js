// backend/models/RentRecord.js

const mongoose = require("mongoose");

const rentRecordSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    month: {
      type: String, // e.g. "2025-11"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: "Manual", // you can extend later
    },
  },
  { timestamps: true }
);

// One record per tenant+room+month
rentRecordSchema.index({ tenant: 1, room: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("RentRecord", rentRecordSchema);
