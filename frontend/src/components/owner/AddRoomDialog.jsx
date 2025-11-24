// frontend/src/components/owner/AddRoomDialog.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import api from '@/api/api'; // Your configured Axios instance

export default function AddRoomDialog({ open, onOpenChange }) {
    const [formData, setFormData] = useState({
        room_number: '',
        type: 'single', // Default room type
        rent_amount: '',
        capacity: '1', 
    });
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation check
        if (!formData.room_number || !formData.rent_amount || !formData.capacity) {
            toast.error("Please fill all fields.");
            setIsLoading(false);
            return;
        }

        try {
            // API Call: POST /api/portal/rooms (protected by 'ownerOnly' middleware)
            const res = await api.post('/portal/rooms', {
                ...formData,
                rent_amount: Number(formData.rent_amount),
                capacity: Number(formData.capacity),
            });

            toast.success(`Room ${res.data.room_number} added successfully!`);
            
            // 💡 CRITICAL STEP: Invalidate the room list cache to force dashboard refresh
            queryClient.invalidateQueries({ queryKey: ['ownerDashboard'] });

            // Reset form and close dialog
            setFormData({ room_number: '', type: 'single', rent_amount: '', capacity: '1' });
            onOpenChange(false);

        } catch (err) {
            const message = err.response?.data?.msg || "Failed to add room. Check if room number exists.";
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
                        <Plus className="h-5 w-5 text-primary" /> Add New Room
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-4">
                        {/* Room Number */}
                        <div className="space-y-2">
                            <Label htmlFor="room_number">Room Number</Label>
                            <Input id="room_number" name="room_number" value={formData.room_number} onChange={handleInputChange} required />
                        </div>
                        
                        {/* Rent Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="rent_amount">Monthly Rent (₹)</Label>
                            <Input id="rent_amount" name="rent_amount" type="number" value={formData.rent_amount} onChange={handleInputChange} required />
                        </div>

                        {/* Room Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Room Type</Label>
                            {/* Simple select dropdown */}
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <option value="single">Single Occupancy</option>
                                <option value="double">Double Occupancy</option>
                                <option value="triple">Triple Occupancy</option>
                            </select>
                        </div>
                        
                        {/* Capacity */}
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Max Capacity</Label>
                            <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} required />
                        </div>
                    </div>
                    
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Create Room"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

AddRoomDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
};