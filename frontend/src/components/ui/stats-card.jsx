// src/components/ui/stats-card.jsx

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";


const variantStyles = {
  default: "border-muted bg-card text-card-foreground",
  success: "border-success/20 bg-success/5 text-foreground",
  warning: "border-warning/20 bg-warning/5 text-foreground", 
  danger: "border-destructive/20 bg-destructive/5 text-foreground"
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
  ...props
}) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10", 
            variant === "danger" && "bg-destructive/10",
            variant === "default" && "bg-primary/10"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              variant === "success" && "text-success",
              variant === "warning" && "text-warning",
              variant === "danger" && "text-destructive", 
              variant === "default" && "text-primary"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}