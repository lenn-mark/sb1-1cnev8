import React from 'react';
import { SubscriptionStatus as SubscriptionStatusType } from '../../types/subscription';
import { formatDate } from '../../utils/shipmentUtils';

interface SubscriptionStatusProps {
  status: SubscriptionStatusType;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ status }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Status</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Current Plan</p>
          <p className="text-lg font-semibold">{status.currentPlan}</p>
        </div>

        <div>
          <p className="text-gray-600">Shipments This Month</p>
          <p className="text-lg font-semibold">{status.shipmentCount}</p>
        </div>

        <div>
          <p className="text-gray-600">Next Billing Date</p>
          <p className="text-lg font-semibold">{formatDate(status.nextBillingDate)}</p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              status.isActive ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`font-medium ${
              status.isActive ? 'text-green-500' : 'text-red-500'
            }`}>
              {status.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};