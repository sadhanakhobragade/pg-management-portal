// frontend/src/components/tenant/SubmitComplaintDialog.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import api from '@/api/api'; // Your configured Axios instance

export default function SubmitComplaintDialog({ open, onOpenChange, userRoomId }) {
    const [formData, setFormData] = useState({
        issue: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleClose = () => {
        setFormData({ issue: '', description: '' });
        onOpenChange(false);
    };

    const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!userRoomId) {
    toast.error("Error: Could not determine your room. Cannot submit complaint.");
    setIsLoading(false);
    return;
  }

  try {
    const complaintData = {
      room: userRoomId,
      issue: formData.issue,
      description: formData.description,
    };

    await api.post('/portal/complaints', complaintData);

    toast.success("Complaint submitted successfully! An owner will review it soon.");

    // Refresh tenant dashboard (your existing line)
    queryClient.invalidateQueries({ queryKey: ['tenantDashboard'] });

    // NEW: also refresh owner dashboard data
    queryClient.invalidateQueries({ queryKey: ['ownerDashboard'] });

    handleClose();
  } catch (err) {
    const message =
      err.response?.data?.msg ||
      "Failed to submit complaint. Please check server connection.";
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
                        <Plus className="h-5 w-5 text-primary" /> Submit New Complaint
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-4">
                        {/* Issue Title */}
                        <div className="space-y-2">
                            <Label htmlFor="issue">Issue Title</Label>
                            <Input id="issue" name="issue" value={formData.issue} onChange={handleInputChange} required />
                        </div>
                        
                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                        </div>
                    </div>
                    
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Submitting..." : "Submit Complaint"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

SubmitComplaintDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    userRoomId: PropTypes.string, 
};