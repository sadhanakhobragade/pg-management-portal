// frontend/src/pages/TenantDashboard.jsx

import React, { useState } from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { TenantOverviewSection } from "@/components/tenant/TenantOverviewSection";
import { ProfileSection } from "@/components/tenant/ProfileSection";
import { TenantComplaintsSection } from "@/components/tenant/TenantComplaintsSection";
import { RentHistorySection } from "@/components/tenant/RentHistorySection";
import { useTenantDashboardData } from "@/hooks/useTenantDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { User, BarChart3, UserCircle, MessageSquare, Receipt } from "lucide-react";
import SubmitComplaintDialog from "@/components/tenant/SubmitComplaintDialog"; 
import EditProfileDialog from "@/components/tenant/EditProfileDialog"; 


export default function TenantDashboard() {
    // 💡 FETCH DATA
    const { data, isLoading, isError, refetch } = useTenantDashboardData(); 
    
    // 💡 DIALOG STATES FOR BUTTONS
    const [activeSection, setActiveSection] = useState("overview");
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);

    const userName = data?.profile?.name || "Tenant";

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <div className="min-h-screen p-8 space-y-8 bg-background">
                <Skeleton className="h-16 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    if (isError || !data || !data.profile) {
        return (
            <div className="min-h-screen p-8 text-center bg-background">
                <h1 className="text-xl font-bold text-destructive pt-16">Error Loading Dashboard</h1>
                <p className="text-muted-foreground">Could not fetch personalized data. Please ensure you are logged in.</p>
            </div>
        );
    }
    
    // --- Success State ---
    const { profile, rentHistory, complaints, upcomingPayment } = data;


    const navItems = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "profile", label: "Profile Information", icon: UserCircle },
        { id: "complaints", label: "My Complaints", icon: MessageSquare },
        { id: "rent-history", label: "Rent History", icon: Receipt },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return <TenantOverviewSection profile={profile} upcomingPayment={upcomingPayment} />;
            case "profile":
                // 💡 PASS THE DIALOG OPENER FUNCTION TO PROFILE SECTION
                return <ProfileSection 
                            profile={profile} 
                            onEditClick={() => setIsEditProfileOpen(true)} 
                        />;
            case "complaints":
                // 💡 PASS THE DIALOG OPENER FUNCTION TO COMPLAINTS SECTION
                return <TenantComplaintsSection 
                            complaints={complaints}
                            onNewComplaintClick={() => setIsComplaintDialogOpen(true)}
                        />;
            case "rent-history":
                // 💡 PASS THE REFETCH FUNCTION FOR 'PAY NOW' LOGIC
                return <RentHistorySection 
                            rentHistory={rentHistory} 
                            onPaymentSuccess={refetch} 
                        />;
            default:
                return <TenantOverviewSection profile={profile} upcomingPayment={upcomingPayment} />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <DashboardNav
                items={navItems}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                title="Tenant Dashboard"
                subtitle={`Welcome back, ${profile.name}!`}
                headerIcon={User}
            />

            <main className="container mx-auto px-4">
                {renderSection()}
            </main>
            
            {/* 💡 RENDER ALL DIALOGS HERE */}
            <EditProfileDialog 
                open={isEditProfileOpen} 
                onOpenChange={setIsEditProfileOpen} 
                currentProfile={profile} 
            />
            <SubmitComplaintDialog 
                open={isComplaintDialogOpen} 
                onOpenChange={setIsComplaintDialogOpen} 
                userRoomId={profile.room_id} // Required for API submission
            />
        </div>
    );
}