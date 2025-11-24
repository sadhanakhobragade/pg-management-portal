//src/components/DashboardNav.jsx


import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PropTypes from "prop-types";

export function DashboardNav({ 
  items, 
  activeSection, 
  onSectionChange, 
  title, 
  subtitle,
  headerIcon: HeaderIcon 
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <HeaderIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <nav className="flex gap-1 bg-muted/30 rounded-lg p-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isActive 
                    ? "bg-card shadow-sm text-primary" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

// ✅ Add prop validation (optional but helpful in JS projects)
DashboardNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  headerIcon: PropTypes.elementType.isRequired,
};
