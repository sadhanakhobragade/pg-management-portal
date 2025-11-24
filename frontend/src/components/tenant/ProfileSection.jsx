// src/components/tenant/ProfileSection.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, IndianRupee } from "lucide-react";
import PropTypes from "prop-types"; 

// 🛑 IMPORTANT: Accepts 'profile' prop (live data) and 'onEditClick' handler
export function ProfileSection({ profile, onEditClick }) { 
   return (
      <section className="py-8">
         <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
         
         <div className="max-w-2xl">
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <User className="h-5 w-5" />
                     Personal Details
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  {/* Name & Room */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="font-semibold text-lg">{profile.name}</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Room Number</label>
                        {/* Displays live room data */}
                        <p className="font-semibold text-lg">Room {profile.room}</p> 
                     </div>
                  </div>
                  
                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        {/* Displays live phone data */}
                        <p className="font-semibold">{profile.phone || 'N/A'}</p> 
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        <p className="font-semibold">{profile.email}</p>
                     </div>
                  </div>
                  
                  {/* Join Date & Rent */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                        {/*  Displays live join date */}
                        <p className="font-semibold">{profile.joinDate}</p> 
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Monthly Rent</label>
                        <p className="font-semibold flex items-center text-primary">
                           <IndianRupee className="h-4 w-4 mr-1" />
                           {profile.rent.toLocaleString()}
                        </p>
                     </div>
                  </div>
                  
                  {/* Security Deposit */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-muted-foreground">Security Deposit</label>
                     <p className="font-semibold flex items-center text-primary">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {/* The hook provides deposit as a raw number */}
                        {profile.deposit.toLocaleString()} 
                     </p>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="pt-4 border-t">
                     <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={onEditClick} // Click handler to open the dialog
                >
                        Edit Profile
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}

// ✅ Prop validation 
ProfileSection.propTypes = {
   profile: PropTypes.shape({
      name: PropTypes.string.isRequired,
      room: PropTypes.string.isRequired, // room_number string
      joinDate: PropTypes.string.isRequired,
      rent: PropTypes.number.isRequired,
      deposit: PropTypes.number.isRequired,
      phone: PropTypes.string, 
      email: PropTypes.string.isRequired,
      room_id: PropTypes.string, // Used by the parent for forms
      _id: PropTypes.string.isRequired, // Tenant ID
   }).isRequired,
  onEditClick: PropTypes.func.isRequired,
};
