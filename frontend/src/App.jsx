//frontend/src/app.jsx 

import React from "react";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import NotFound from "./pages/NotFound";
import AuthRoute from "./components/AuthRoute";

const queryClient = new QueryClient();

const App = () => (
  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          {/* OWNER PROTECTED ROUTE */}
            <Route element={<AuthRoute allowedRoles={['owner']} />}>
           <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>


          {/* TENANT PROTECTED ROUTE */}
        <Route element={<AuthRoute allowedRoles={['tenant']} />}>
           <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        </Route>
        
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

<Chatbot />

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;






