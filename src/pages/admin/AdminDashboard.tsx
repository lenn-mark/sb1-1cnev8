import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminStats from '../../components/admin/AdminStats';
import UserManagement from '../../components/admin/UserManagement';
import SubscriptionManagement from '../../components/admin/SubscriptionManagement';
import SystemUsage from '../../components/admin/SystemUsage';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <AdminStats />
      
      <Routes>
        <Route index element={<UserManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="usage" element={<SystemUsage />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;