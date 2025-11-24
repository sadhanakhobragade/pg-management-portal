// frontend/src/components/tenant/RentHistorySection.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CreditCard } from "lucide-react";
import { toast } from "sonner";
import PropTypes from "prop-types";
import api from '@/api/api'; //  API instance for payment simulation

export function RentHistorySection({ rentHistory, onPaymentSuccess }) { 

    const getStatusBadge = (status) => {
        const variants = {
            Paid: "default",
            Pending: "warning",
            Overdue: "destructive"
        };
        return (
            <Badge variant={variants[status] || "default"}>
                {status}
            </Badge>
        );
    };

    //  Function to simulate API payment and refresh dashboard
    const handlePayNow = async (rentRecordId) => {
        if (!window.confirm("Confirm payment. This will mark the record as Paid.")) {
            return;
        }
        
        try {
            toast.info("Processing payment...");

            // API Call: PUT /api/portal/rent/pay
            await api.put('/portal/rent/pay', { rentRecordId }); 

            toast.success("Payment confirmed! Rent recorded as PAID.");
            
            //  Call the refetch handler passed from the parent 
            // to update the Rent History list immediately.
            onPaymentSuccess(); 

        } catch (error) {
            toast.error("Payment failed. Please try again.");
        }
    };


    return (
        <section className="py-8">
            <h2 className="text-2xl font-semibold mb-6">Rent History</h2>
            
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-4 font-medium">Month</th>
                                    <th className="text-left p-4 font-medium">Amount</th>
                                    <th className="text-left p-4 font-medium">Due Date</th>
                                    <th className="text-left p-4 font-medium">Paid Date</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                    <th className="text-left p-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentHistory.map((rent) => (
                                    <tr key={rent.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-medium">{rent.month}</td>
                                        <td className="p-4">
                                            <div className="flex items-center text-primary font-semibold">
                                                <IndianRupee className="h-4 w-4 mr-1" />
                                                {rent.amount.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4">{rent.dueDate}</td>
                                        <td className="p-4 text-muted-foreground">
                                            {rent.paidDate || "Not paid yet"}
                                        </td>
                                        <td className="p-4">{getStatusBadge(rent.status)}</td>
                                        <td className="p-4">
                                            {rent.status === "Pending" || rent.status === "Overdue" ? (
                                                <Button 
                                                    size="sm" 
                                                    className="bg-gradient-secondary hover:bg-secondary-glow"
                                                    onClick={() => handlePayNow(rent.id)} // HANDLER
                                                >
                                                    <CreditCard className="mr-2 h-3 w-3" />
                                                    Pay Now
                                                </Button>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

RentHistorySection.propTypes = {
    rentHistory: PropTypes.array.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired, // HANDLER
};
