// frontend/src/components/tenant/TenantComplaintsSection.jsx

import React from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

function statusStyle(status) {
  const s = (status || "").toLowerCase();
  if (s === "pending") return "bg-amber-100 text-amber-800";
  if (s === "in-progress") return "bg-blue-100 text-blue-800";
  if (s === "resolved") return "bg-emerald-100 text-emerald-800";
  return "bg-slate-100 text-slate-700";
}

export function TenantComplaintsSection({ complaints, onNewComplaintClick }) {
  const queryClient = useQueryClient();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      await api.delete(`/portal/complaints/${id}`);

      toast.success("Complaint deleted.");

      queryClient.invalidateQueries({ queryKey: ["tenantDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ownerDashboard"] });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.msg || "Failed to delete complaint.";
      toast.error(msg);
    }
  };

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            My Complaints
          </h2>
          <p className="text-medium text-slate-500 mb-1">
            View, add, or delete your complaints.
          </p>
        </div>
        <Button
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={onNewComplaintClick}
        >
          <Plus className="h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* Table wrapper */}
      <div className="border border-slate-200 rounded-lg bg-white">
        {(!complaints || complaints.length === 0) ? (
          <div className="px-4 py-3 text-xs text-slate-500">
            You have not submitted any complaints yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-[17px] font-medium text-slate-2000">
                  <th className="px-4 py-2">Issue</th>
                  <th className="px-4 py-2">Room</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {complaints.map((c) => {
                  const id = c.id || c._id;

                  return (
                    <tr key={id} className="text-slate-800">
                      <td className="px-4 py-2 max-w-[2220px]">
                        <div className="font-medium truncate ext-[16px]">
                          {c.issue || "No title"}
                        </div>
                        <div className="hidden md:block text-[14px] text-slate-500 truncate">
                          {c.description || "No description provided."}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {c.roomNumber ||
                          c.room?.room_number ||
                          "Not linked"}
                      </td>
                      <td className="px-4 py-2">
                        <Badge className={statusStyle(c.status)}>
                          {c.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => handleDelete(id)}
                          className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
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

TenantComplaintsSection.propTypes = {
  complaints: PropTypes.array,
  onNewComplaintClick: PropTypes.func,
};
