// frontend/src/components/owner/ComplaintsSection.jsx

import React from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function statusStyle(status) {
  const s = (status || "").toLowerCase();
  if (s === "pending") return "bg-amber-100 text-amber-800";
  if (s === "in-progress") return "bg-blue-100 text-blue-800";
  if (s === "resolved") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-700";
}

export function ComplaintsSection({ complaints }) {
  const queryClient = useQueryClient();

  const handleResolve = async (id) => {
    try {
      await api.put(`/portal/complaints/${id}/status`, { status: "Resolved" });

      toast.success("Complaint marked as resolved.");

      queryClient.invalidateQueries({ queryKey: ["ownerDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["tenantDashboard"] });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.msg || "Failed to update complaint status.";
      toast.error(msg);
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Recent Complaints
          </h2>
          <p className="mb-6 text-slate-500">
            Track tenant issues and resolve them quickly.
          </p>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="border border-slate-200 rounded-lg bg-white">
        {(!complaints || complaints.length === 0) ? (
          <div className="px-4 py-3 text-xs text-slate-500">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-[17px] font-medium text-slate-2000">
                  <th className="px-4 py-2">Issue</th>
                  <th className="px-4 py-2">Tenant</th>
                  <th className="px-4 py-2">Room</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {complaints.map((c) => {
                  const id = c._id || c.id;
                  return (
                    <tr key={id} className="text-slate-800">
                      <td className="px-4 py-2 max-w-[2220px]">
                        <div className="font-medium truncate text-[16px]">
                          {c.issue || "No title"}
                        </div>
                        <div className="hidden md:block text-[14px] text-slate-500 truncate">
                          {c.description || "No description provided."}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {c.tenant?.name || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {c.room?.room_number || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        <Badge className={statusStyle(c.status)}>
                          {c.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        {String(c.status).toLowerCase() !== "resolved" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px]"
                            onClick={() => handleResolve(id)}
                          >
                            Mark Resolved
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

ComplaintsSection.propTypes = {
  complaints: PropTypes.array,
};
