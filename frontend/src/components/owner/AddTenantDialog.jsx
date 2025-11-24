// frontend/src/components/owner/AddTenantDialog.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/api/api";
import axios from "axios";

// Registration endpoint for backend auth
const API_URL = "http://localhost:5000/api/auth/register";

export default function AddTenantDialog({
  open,
  onOpenChange,
  vacantRooms,
  selectedRoomId, // NEW
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    room: "", // Room _id (optional)
  });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // When dialog opens from Room card, pre-select that room
  useEffect(() => {
    if (selectedRoomId) {
      setFormData((prev) => ({
        ...prev,
        room: selectedRoomId,
      }));
    }
  }, [selectedRoomId]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      room: "",
    });
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "tenant",
    };

    try {
      // 1️⃣ Register tenant via /api/auth/register
      await axios.post(API_URL, registrationData);

      // 2️⃣ If a room is selected, find tenant id and assign to that room
      if (formData.room) {
        // fetch tenant list to get the new tenant's id
        const tenantsRes = await api.get("/portal/tenant-list");
        const tenants = tenantsRes.data || [];

        const newTenant = tenants.find(
          (t) => t.email.toLowerCase() === formData.email.toLowerCase()
        );

        if (!newTenant) {
          throw new Error("Tenant registered but not found in tenant list.");
        }

        const tenantId = newTenant.id; // from portalRoutes formatting

        await api.put(`/portal/rooms/${formData.room}/assign`, {
          tenantId,
          action: "assign",
        });
      }

      toast.success(`Tenant ${formData.name} added successfully!`);

      // 3️⃣ Refresh owner dashboard (rooms + tenants + stats)
      queryClient.invalidateQueries({ queryKey: ["ownerDashboard"] });

      // 4️⃣ Close + reset
      handleClose();
    } catch (err) {
      console.error("Add tenant error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Failed to add tenant. Check if email already exists.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Add New Tenant
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (Login ID)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Room Assignment */}
            <div className="space-y-2">
              <Label htmlFor="room">Assign Vacant Room (Optional)</Label>
              <select
                id="room"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">Do Not Assign Now (Keep Vacant)</option>
                {vacantRooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.room_number} (₹{room.rent_amount})
                  </option>
                ))}
              </select>
              {vacantRooms.length === 0 && (
                <p className="text-sm text-orange-500">
                  No rooms available to assign.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Registering..." : "Add New Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AddTenantDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  vacantRooms: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      room_number: PropTypes.string.isRequired,
      rent_amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedRoomId: PropTypes.string, // NEW
};
