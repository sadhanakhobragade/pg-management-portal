// frontend/src/components/AuthRoute.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'sonner';

// This component checks if the user is logged in AND has the required role.
export default function AuthRoute({ allowedRoles }) {
    // 1. Get Authentication Data
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // 2. Check Authentication
    if (!token) {
        // Not logged in: Redirect to login page
        toast.error("Please log in to access the dashboard.");
        return <Navigate to="/login" replace />;
    }

    // 3. Check Authorization (Role)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Logged in but wrong role: Show error and redirect to home
        toast.error("Access Denied: You do not have permission.");
        return <Navigate to="/" replace />;
    }

    // 4. Authorized: Render the nested route component (Outlet)
    return <Outlet />;
}

AuthRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};