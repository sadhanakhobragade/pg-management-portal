// frontend/src/hooks/useTenantDashboardData.js

import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

// Helper to convert "2025-11" -> "November 2025"
const formatMonthLabel = (monthStr, fallbackDate) => {
  try {
    if (monthStr) {
      const [year, month] = monthStr.split("-");
      const d = new Date(Number(year), Number(month) - 1, 1);
      return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
    if (fallbackDate) {
      const d = new Date(fallbackDate);
      return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
  } catch {
    // ignore
  }
  return "N/A";
};

const fetchTenantDashboardData = async () => {
  const [userRes, complaintsRes, rentRes] = await Promise.all([
    api.get("/portal/me"),
    api.get("/portal/complaints/me"),
    api.get("/portal/rent/history"),
  ]);

  const user = userRes.data;
  const complaints = complaintsRes.data;
  const rentRecords = rentRes.data || [];

  // Map backend RentRecord -> UI model used by RentHistorySection
  const rentHistory = rentRecords.map((r) => ({
    id: r._id,
    month: formatMonthLabel(r.month, r.dueDate),
    amount: r.amount,
    dueDate: r.dueDate
      ? new Date(r.dueDate).toLocaleDateString("en-GB")
      : "N/A",
    paidDate: r.paidAt
      ? new Date(r.paidAt).toLocaleDateString("en-GB")
      : null,
    status: r.status,
  }));

  // Find next pending/overdue payment for overview
  const today = new Date();
  const upcoming = rentRecords
    .filter((r) => r.status !== "Paid")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  const upcomingPayment = upcoming
    ? {
        amount: upcoming.amount,
        dueDate: new Date(upcoming.dueDate).toLocaleDateString("en-GB"),
        daysLeft: Math.ceil(
          (new Date(upcoming.dueDate) - today) / (1000 * 60 * 60 * 24)
        ),
      }
    : {
        amount: user.room ? user.room.rent_amount : 0,
        dueDate: "N/A",
        daysLeft: "N/A",
      };

  return {
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone || "N/A",
      room: user.room ? user.room.room_number : "Unassigned",
      rent: user.room ? user.room.rent_amount : 0,
      deposit: user.room ? user.room.rent_amount * 2 : 0,
      joinDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "N/A",
      _id: user._id,
      room_id: user.room ? user.room._id : null,
    },
    rentHistory,
    complaints,
    upcomingPayment,
  };
};

export function useTenantDashboardData() {
  const isAuthenticated = !!localStorage.getItem("token");

  return useQuery({
    queryKey: ["tenantDashboard"],
    queryFn: fetchTenantDashboardData,
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });
}
