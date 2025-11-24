// frontend/src/components/owner/OverviewSection.jsx
import React from "react";
import PropTypes from "prop-types";
import { StatsCard } from "@/components/ui/stats-card";
import { Home, Users, DoorOpen, IndianRupee } from "lucide-react";

export function OverviewSection({ stats }) {
  const occupancyPercent =
    stats.totalRooms > 0
      ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
      : 0;

  return (
    <section className="pg-section">
      <h2 className="text-2xl font-semibold">Overview</h2>
      <p className="pg-subtitle mb-6">
        Quick snapshot of your PG performance this month.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  text-2xl font-bold">
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          subtitle={`${occupancyPercent}% occupied`}
          icon={Home}
        />
        <StatsCard
          title="Active Tenants"
          value={stats.activeTenants}
          subtitle="Currently staying"
          icon={Users}
          variant="success"
        />
        <StatsCard
          title="Vacant Rooms"
          value={stats.vacantRooms}
          subtitle="Ready for new tenants"
          icon={DoorOpen}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
          subtitle="Collected rent this month"
          icon={IndianRupee}
          variant="success"
        />
      </div>
    </section>
  );
}

OverviewSection.propTypes = {
  stats: PropTypes.shape({
    totalRooms: PropTypes.number.isRequired,
    occupiedRooms: PropTypes.number.isRequired,
    activeTenants: PropTypes.number.isRequired,
    vacantRooms: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
  }).isRequired,
};
