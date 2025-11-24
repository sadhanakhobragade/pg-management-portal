// frontend/src/components/owner/TenantDetailsDialog.jsx

import React from "react";
import PropTypes from "prop-types";
import {
  IndianRupee,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  User as UserIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Note: The dialog expects the entire tenant object
export default function TenantDetailsDialog({ open, onOpenChange, tenant }) {
  if (!tenant) return null; // Safety check

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold border-b pb-2 flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" /> {tenant.name} Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Role/Status */}
          <div className="flex justify-between items-center">
            <Badge className="text-sm font-medium bg-primary/10 text-primary">
              TENANT
            </Badge>
            <Badge className={getStatusColor(tenant.rentStatus)}>
              {tenant.rentStatus}
            </Badge>
          </div>

          {/* Room & Rent Info */}
          <Card>
                        <CardContent className="p-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><MapPin /> Room:</span>
                                <span className="font-semibold">{tenant.room || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><CreditCard /> Rent:</span>
                                <span className="font-semibold">₹{tenant.rentAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2">
                                <span className="text-muted-foreground flex items-center gap-2"><Calendar /> Due:</span>
                                <span className="font-semibold text-destructive">{tenant.dueDate}</span>
                            </div>
                        </CardContent>
                    </Card>

          {/* Contact Info */}
          <div className="space-y-2 border-t pt-4">
            <p className="text-lg font-semibold">Contact Information</p>
            <p className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" /> {tenant.email}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />{" "}
              {tenant.phone || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              Joined: {tenant.joinDate}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

//prop validation

TenantDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  tenant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    rentAmount: PropTypes.number.isRequired,
    rentStatus: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    joinDate: PropTypes.string.isRequired,
  }),
};
