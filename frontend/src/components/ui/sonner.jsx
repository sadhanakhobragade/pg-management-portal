// src/components/ui/sonner.jsx
import React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import PropTypes from "prop-types"; // Added PropTypes for prop validation

const Toaster = ({ theme: themeProp, ...props })=> {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};


// PropTypes help validate props at runtime and silence ESLint warnings.
Toaster.propTypes = {
    // Sonner props are complex, typically you validate the few you customize, 
    // and rely on the global ESLint override for the rest.
    theme: PropTypes.oneOf(['light', 'dark', 'system']),
};

export { Toaster, toast };
