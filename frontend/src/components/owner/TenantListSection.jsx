import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import { MapPin, User as UserIcon, Trash, Mail, Phone } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api/api";

export function TenantListSection({
  tenants,
  onAddTenantClick,
  onDetailClick,
}) {
  const queryClient = useQueryClient();

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Overdue":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleDeleteTenant = async (tenantId, tenantName) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${tenantName}? This will permanently delete their account and vacate their room.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/portal/tenants/${tenantId}`);
      toast.success(
        `${tenantName} has been deleted and their room is now vacant.`
      );
      queryClient.invalidateQueries({ queryKey: ["ownerDashboard"] });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete tenant.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Tenant List
        </h2>
        <Button onClick={onAddTenantClick}>
          <UserIcon className="mr-2 h-4 w-4" />
          Add New Tenant
        </Button>
      </div>

      <div className="grid gap-1.5">
        {tenants.length === 0 ? (
          <p className="text-center text-muted-foreground p-10">
            No tenants currently registered.
          </p>
        ) : (
          tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-2">
                <div className="flex items-start justify-between">
                  {/* Left Side (Avatar + Info) */}
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {tenant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      {/* Name, Room, Join Date */}

                        <h3 className="text-lg font-semibold text-foreground">
                          {tenant.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Room {tenant.room}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {tenant.email}
                          </div>
                        </div>
                      
                    </div>
                  </div>

                  {/* Right Side (Rent + Status) */}

                  <div className="text-right space-y-2">
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Badge className={getStatusColor(tenant.rentStatus)}>
                        {tenant.rentStatus}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDetailClick(tenant)}
                      >
                        View Details
                      </Button>

                      {/* 🛑 DELETE BUTTON */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDeleteTenant(tenant.id, tenant.name)
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ✅ Prop validation
TenantListSection.propTypes = {
  onAddTenantClick: PropTypes.func.isRequired,
  onDetailClick: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      room: PropTypes.string,
      rentAmount: PropTypes.number.isRequired,
      joinDate: PropTypes.string.isRequired,
      rentStatus: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ).isRequired,
};
