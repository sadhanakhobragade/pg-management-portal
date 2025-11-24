// frontend/src/hooks/useOwnerDashboardData.js

import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';

// Central fetch function
const fetchDashboardData = async () => {
  const results = await Promise.allSettled([
    api.get("/portal/me"),
    api.get("/portal/rooms/all"),
    api.get("/portal/complaints"),
    api.get("/portal/tenant-list"),
    api.get("/portal/rent/summary"), // NEW
  ]);

  const userRes =
    results[0].status === "fulfilled" ? results[0].value.data : {};
  const rooms =
    results[1].status === "fulfilled" ? results[1].value.data : [];
  const complaints =
    results[2].status === "fulfilled" ? results[2].value.data : [];
  const tenants =
    results[3].status === "fulfilled" ? results[3].value.data : [];
  const rentSummary =
    results[4].status === "fulfilled" ? results[4].value.data : null;

  const occupiedRooms = rooms.filter(
    (r) => r.status.toLowerCase() === "occupied"
  ).length;

  // Fallback computed revenue (if API fails)
  const fallbackRevenue = rooms
    .filter((r) => r.status.toLowerCase() === "occupied")
    .reduce((sum, room) => sum + (room.rent_amount || 0), 0);

  const activeTenantsCount = tenants.length;
  const vacantRooms = rooms.filter(
    (r) => r.status.toLowerCase() === "vacant"
  );

  // Use backend rent summary if available
  const paidTotal = rentSummary?.totals?.Paid || 0;
  const pendingTotal = rentSummary?.totals?.Pending || 0;
  const overdueTotal = rentSummary?.totals?.Overdue || 0;
  const outstandingTotal = pendingTotal + overdueTotal;

  return {
    user: userRes,
    rooms,
    complaints,
    vacantRooms,
    tenants,
    stats: {
      totalRooms: rooms.length,
      occupiedRooms,
      activeTenants: activeTenantsCount,
      vacantRooms: rooms.length - occupiedRooms,
      // Revenue = total Paid from RentRecord, fallback to computed if null
      totalRevenue: paidTotal || fallbackRevenue,
      pendingComplaints: complaints.filter(
        (c) => c.status === "Pending"
      ).length,
      // NEW: real pending+overdue rent
      pendingRent: outstandingTotal,
    },
  };
};


export function useOwnerDashboardData() {
  const isAuthenticated = !!localStorage.getItem('token');

  return useQuery({
    queryKey: ['ownerDashboard'], // IMPORTANT: stable key
    queryFn: fetchDashboardData,
    enabled: isAuthenticated,
    refetchInterval: 60000, // auto-refresh every 60s
    retry: 1,
  });
}
