// frontend/src/components/tenant/EditProfileDialog.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import api from '@/api/api'; 

export default function EditProfileDialog({ open, onOpenChange, currentProfile }) {
    // Initialize state with the profile data received as props
    const [formData, setFormData] = useState({
        name: currentProfile.name,
        email: currentProfile.email,
        phone: currentProfile.phone || '',
        // Note: Password/Room cannot be edited here for security/logic reasons
    });
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    // Effect to reset/update form data when currentProfile prop changes (important for React Query updates)
    React.useEffect(() => {
        setFormData({
            name: currentProfile.name,
            email: currentProfile.email,
            phone: currentProfile.phone || '',
        });
    }, [currentProfile]);

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 🛑 API Call: PUT /api/portal/me (The backend endpoint for updating the logged-in user)
            // We only send the fields that can be updated (Name and Phone)
            await api.put('/portal/me', {
                name: formData.name,
                phone: formData.phone,
            });

            toast.success("Profile updated successfully!");
            
            // CRITICAL: Invalidate the tenant dashboard query to force a data refresh
            queryClient.invalidateQueries({ queryKey: ['tenantDashboard'] });

            onOpenChange(false); // Close the dialog on success

        } catch (err) {
            const message = err.response?.data?.message || "Failed to update profile.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="h-5 w-5 text-primary" /> Edit Your Profile
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    
                    {/* Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                    </div>
                    
                    {/* Email Input - Disabled as it's the unique login ID */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email || ''} disabled />
                    </div>
                    
                    {/* Phone Input */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="text" value={formData.phone || ''} onChange={handleInputChange} />
                    </div>


                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

EditProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    currentProfile: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string,
    }).isRequired,
};