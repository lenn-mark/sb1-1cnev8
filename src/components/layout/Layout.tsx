import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;