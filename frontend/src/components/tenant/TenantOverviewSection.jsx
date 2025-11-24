// src/components/tenant/TenantOverviewSection.jsx

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";

import {
  IndianRupee,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import api from "@/api/api";

/**
 * Shows dynamic rent reminder based on upcomingPayment
 */
function RentReminderBanner({ upcomingPayment }) {
  if (!upcomingPayment) return null;

  const { amount, dueDate, daysLeft } = upcomingPayment;

  const hasValidAmount = typeof amount === "number" && amount > 0;
  const hasValidDays = typeof daysLeft === "number" && !Number.isNaN(daysLeft);

  // If we don't have enough info, don't show anything
  if (!hasValidAmount || !hasValidDays) return null;

  // Too early → no banner at all
  if (daysLeft > 3) return null;

  // Decide tone (just for color + icon)
  let tone = "info"; // "info" | "warn" | "danger" | "ok";

  if (daysLeft > 0) {
    tone = "warn";
  } else if (daysLeft === 0) {
    tone = "warn";
  } else {
    tone = "danger";
  }

  const toneClasses = {
    info: "border-sky-200 bg-sky-50",
    warn: "border-amber-200 bg-amber-50",
    danger: "border-red-200 bg-red-50",
    ok: "border-emerald-200 bg-emerald-50",
  };

  const Icon =
    tone === "danger"
      ? AlertCircle
      : tone === "warn"
      ? Clock
      : tone === "ok"
      ? CheckCircle2
      : Clock;

  const badgeText =
    tone === "danger" ? "Overdue" : tone === "warn" ? "Upcoming" : "Info";

  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Call AI endpoint when data changes
  useEffect(() => {
    if (!hasValidAmount || !hasValidDays || daysLeft > 3) {
      setAiText("");
      setErrorMsg("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg("");

    api
      .post("/portal/rent/reminder-text", {
        amount,
        dueDate,
        daysLeft,
      })
      .then((res) => {
        if (cancelled) return;
        const text = res.data?.text?.trim();
        if (text) {
          setAiText(text);
        } else {
          setErrorMsg("Unable to load AI reminder.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg("Unable to load AI reminder.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [amount, dueDate, daysLeft, hasValidAmount, hasValidDays]);

  // If AI completely failed -> we can still show nothing
  if (!loading && !aiText && errorMsg) {
    // you can decide: return null OR show simple fallback text
    return null;
  }

  const title =
    tone === "danger"
      ? "Rent overdue"
      : tone === "warn"
      ? "Rent reminder"
      : "Notice";

  const description = loading ? "Generating a smart reminder..." : aiText || ""; // if AI text present, show it

  if (!description) return null;

  return (
    <Card className={`mb-4 ${toneClasses[tone]}`}>
      <CardContent className="py-3 px-4 flex items-start gap-3">
        <div className="mt-0.5">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <Badge variant="outline" className="text-xs">
              {badgeText}
            </Badge>
          </div>
          <p className="text-xs text-slate-700 leading-snug">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TenantOverviewSection({ profile, upcomingPayment }) {
  return (
    <section className="py-8">
      {/* AI-powered rent reminder */}
      <RentReminderBanner upcomingPayment={upcomingPayment} />

      <h2 className="text-2xl font-semibold mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  text-2xl font-bold">
        <StatsCard
          title="Current Rent"
          value={`₹${profile.rent.toLocaleString()}`}
          subtitle="Monthly"
          icon={IndianRupee}
        />
        <StatsCard
          title="Next Due"
          value={
            typeof upcomingPayment.daysLeft === "number"
              ? upcomingPayment.daysLeft
              : "-"
          }
          subtitle={
            upcomingPayment.dueDate
              ? `days (${upcomingPayment.dueDate})`
              : "No rent scheduled"
          }
          icon={Clock}
          variant={
            typeof upcomingPayment.daysLeft === "number" &&
            upcomingPayment.daysLeft <= 3
              ? "warning"
              : "success"
          }
        />
        <StatsCard
          title="Room Number"
          value={profile.room}
          subtitle="Allocated room"
          icon={User}
          variant="success"
        />
        <StatsCard
          title="Deposit Paid"
          value={`₹${(profile.deposit / 1000).toFixed(0)}K`}
          subtitle="Security deposit"
          icon={CheckCircle}
          variant="success"
        />
      </div>
    </section>
  );
}
