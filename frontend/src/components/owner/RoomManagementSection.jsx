// frontend/src/components/owner/RoomManagementSection.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Clock, Plus, Users } from "lucide-react";
import AddRoomDialog from "./AddRoomDialog";
import PropTypes from "prop-types";

import roomSingleImage from "@/assets/room-single.jpg";
import roomDoubleImage from "@/assets/room-double.jpg";
import roomTripleImage from "@/assets/room-triple.jpg";

export function RoomManagementSection({ rooms, onAddTenantClick }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- Helper Functions ---
  const getStatusBadge = (status) => {
    const variants = {
      occupied: "default", // Changed to lowercase to match database
      vacant: "secondary",
      maintenance: "destructive",
    };
    // Use lowercase status for consistency
    return (
      <Badge
        variant={variants[status.toLowerCase()] || "default"}
        className="capitalize"
      >
        {status}
      </Badge>
    );
  };

  const getRoomImage = (type) => {
    switch (type.toLowerCase()) {
      case "single":
        return roomSingleImage;
      case "double":
        return roomDoubleImage;
      case "triple":
        return roomTripleImage;
      default:
        return roomSingleImage;
    }
  };

  const getRoomCapacity = (type) => {
    switch (type.toLowerCase()) {
      case "single":
        return 1;
      case "double":
        return 2;
      case "triple":
        return 3;
      default:
        return 1;
    }
  };

  return (
    <>
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Room Management</h2>
          <Button
            className="bg-gradient-primary hover:bg-primary-glow"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card
              key={room._id}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getRoomImage(room.type)}
                  alt={`${room.type} occupancy room`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  {/* 🛑 FIX: Use status exactly as it is saved (e.g., "occupied") */}
                  {getStatusBadge(room.status)}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 rounded-lg px-2 py-1">
                  <div className="flex items-center text-white text-sm">
                    <Users className="h-3 w-3 mr-1" />
                    {getRoomCapacity(room.type)} Guest
                    {getRoomCapacity(room.type) > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Room {room.room_number}
                  </CardTitle>
                  <span className="text-sm font-medium text-muted-foreground capitalize">
                    {room.type}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rent</span>
                    <span className="font-semibold flex items-center text-primary">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {room.rent_amount.toLocaleString()}
                    </span>
                  </div>

                  {/* 🛑 FIX: The conditional rendering based on current_tenant */}
                  {room.current_tenant ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Tenant
                        </span>
                        {/* Display the populated name */}
                        <span className="font-medium">
                          {room.current_tenant.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Due Date
                        </span>
                        <span className="text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {"2025-01-01"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3"
                      >
                        View Details
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Room Available
                      </p>
                      <Button
  size="sm"
  className="w-full bg-gradient-secondary hover:bg-secondary-glow"
  onClick={() => onAddTenantClick && onAddTenantClick(room._id)}
>
  Add Tenant
</Button>

                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <AddRoomDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

// ✅ Prop validation
RoomManagementSection.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired, // Use _id from MongoDB
      room_number: PropTypes.string.isRequired, //  room_number
      type: PropTypes.string.isRequired,
      rent_amount: PropTypes.number.isRequired, //  'rent' to 'rent_amount'
      status: PropTypes.string.isRequired,
      // current_tenant will be an object or null
      current_tenant: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.oneOf([null]),
      ]),
    })
  ).isRequired,
};
