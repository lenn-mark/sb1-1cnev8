import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShipmentList from '../../components/dashboard/ShipmentList';
import ShipmentDetails from '../../components/dashboard/ShipmentDetails';
import AlarmsList from '../../components/dashboard/AlarmsList';
import SubscriptionDetails from '../../components/dashboard/SubscriptionDetails';
import DashboardStats from '../../components/dashboard/DashboardStats';
import SettingsPage from './SettingsPage';
import TriggeredShipmentsPage from './TriggeredShipmentsPage';

const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <Routes>
        <Route index element={<ShipmentList />} />
        <Route path="shipments/:id" element={<ShipmentDetails />} />
        <Route path="alarms" element={<AlarmsList />} />
        <Route path="triggered" element={<TriggeredShipmentsPage />} />
        <Route path="subscription" element={<SubscriptionDetails />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
};

export default UserDashboard;