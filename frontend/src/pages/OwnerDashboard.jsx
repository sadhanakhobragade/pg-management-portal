// frontend/src/pages/OwnerDashboard.jsx

import React, { useState } from "react";
import { SidebarLayout } from "@/components/SidebarLayout";
import { OverviewSection } from "@/components/owner/OverviewSection";
import { RoomManagementSection } from "@/components/owner/RoomManagementSection";
import { ComplaintsSection } from "@/components/owner/ComplaintsSection";
import { TenantListSection } from "@/components/owner/TenantListSection";
import { DashboardNav } from "@/components/DashboardNav";
import { Skeleton } from "@/components/ui/skeleton";
import { useOwnerDashboardData } from "@/hooks/useOwnerDashboardData";
import { Home, Users, MessageSquare, BarChart3, Building } from "lucide-react";
import AddTenantDialog from "@/components/owner/AddTenantDialog";
import TenantDetailsDialog from "@/components/owner/TenantDetailsDialog";

export default function OwnerDashboard() {
  const { data, isLoading, isError } = useOwnerDashboardData();

  const [activeSection, setActiveSection] = useState("overview");
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null); // NEW

  const userName = data?.user?.name || "Owner";

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "rooms", label: "Room Management", icon: Home },
    { id: "tenants", label: "Tenant List", icon: Users },
    { id: "complaints", label: "Recent Complaints", icon: MessageSquare },
  ];

  // Common handler for opening Add Tenant dialog
  const handleOpenAddTenant = (roomId = null) => {
    setSelectedRoomId(roomId);      // remember which room (or null)
    setIsTenantDialogOpen(true);    // open dialog
  };

  const renderSection = (sectionId, data, stats) => {
    switch (sectionId) {
      case "overview":
        return <OverviewSection stats={stats} />;
      case "rooms":
        return (
          <RoomManagementSection
            rooms={data.rooms}
            onAddTenantClick={handleOpenAddTenant} // gets roomId from card
          />
        );
      case "tenants":
        return (
          <TenantListSection
            tenants={data.tenants || []}
            onAddTenantClick={() => handleOpenAddTenant(null)} // Add New Tenant button
            onDetailClick={(tenant) => {
              setSelectedTenant(tenant);
              setIsDetailDialogOpen(true);
            }}
          />
        );
      case "complaints":
        return <ComplaintsSection complaints={data.complaints} />;
      default:
        return <OverviewSection stats={stats} />;
    }
  };

  if (isLoading) {
    return (
      <SidebarLayout userName={userName}>
        <div className="p-8 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (isError || !data) {
    return (
      <SidebarLayout userName={userName}>
        <div className="p-8 text-center text-destructive">
          <h1 className="text-xl font-bold">Error Loading Dashboard</h1>
          <p>Could not connect to the API or fetch data. Please check backend.</p>
        </div>
      </SidebarLayout>
    );
  }

  const { rooms, complaints, stats, tenants } = data;
  const vacantRooms = rooms.filter((r) => r.status === "Vacant");

  return (
    <>
      <SidebarLayout userName={userName}>
        <DashboardNav
          items={navItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          title="Owner Dashboard"
          subtitle={`Welcome back, ${userName}! Here's your PG overview.`}
          headerIcon={Building}
        />

        <main className="container mx-auto px-4 py-6">
          {renderSection(activeSection, data, stats)}
        </main>
      </SidebarLayout>

      <AddTenantDialog
        open={isTenantDialogOpen}
        onOpenChange={(open) => {
          setIsTenantDialogOpen(open);
          if (!open) {
            setSelectedRoomId(null); // clear when closed
          }
        }}
        vacantRooms={vacantRooms}
        selectedRoomId={selectedRoomId} // NEW
      />

      <TenantDetailsDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        tenant={selectedTenant}
      />
    </>
  );
}
