// frontend/src/components/SidebarLayout.jsx

import React from 'react';
import PropTypes from 'prop-types';

// This is a minimal working placeholder component
export function SidebarLayout({ children, userName }) {
  // Replace this with your actual sidebar structure later.
  return (
    <div className="min-h-screen flex flex-col">
      {/* --- Simple Navbar/Header Placeholder --- */}
      <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">PG Dashboard</h1>
        <div className="text-sm">Welcome, {userName || 'User'}</div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

SidebarLayout.propTypes = {
    children: PropTypes.node.isRequired,
    userName: PropTypes.string,
};