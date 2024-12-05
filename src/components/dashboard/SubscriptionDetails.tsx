import React, { useState } from 'react';
import { CreditCard, Package, ArrowUpCircle } from 'lucide-react';
import { formatDate } from '../../utils/shipmentUtils';
import UpgradePlan from '../subscription/UpgradePlan';
import BillingHistory from '../subscription/BillingHistory';

const SubscriptionDetails: React.FC = () => {
  const [showUpgradePlan, setShowUpgradePlan] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);

  const subscription = {
    plan: 'Professional',
    status: 'active',
    shipments: {
      used: 458,
      total: 1000
    },
    billingPeriod: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31')
    },
    nextBilling: new Date('2024-02-01')
  };

  if (showUpgradePlan) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Upgrade Plan</h2>
          <button
            onClick={() => setShowUpgradePlan(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Subscription
          </button>
        </div>
        <UpgradePlan />
      </div>
    );
  }

  if (showBillingHistory) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Billing History</h2>
          <button
            onClick={() => setShowBillingHistory(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Subscription
          </button>
        </div>
        <BillingHistory />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Details</h3>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <h4 className="text-sm font-medium text-gray-500">Current Plan</h4>
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">{subscription.plan}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
              {subscription.status}
            </span>
          </div>

          <div>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-3" />
              <h4 className="text-sm font-medium text-gray-500">Shipment Usage</h4>
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {subscription.shipments.used} / {subscription.shipments.total}
            </p>
            <div className="mt-2 relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${(subscription.shipments.used / subscription.shipments.total) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <ArrowUpCircle className="h-5 w-5 text-gray-400 mr-3" />
              <h4 className="text-sm font-medium text-gray-500">Billing Period</h4>
            </div>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(subscription.billingPeriod.start)} - {formatDate(subscription.billingPeriod.end)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Next billing: {formatDate(subscription.nextBilling)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => setShowUpgradePlan(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upgrade Plan
          </button>
          <button
            onClick={() => setShowBillingHistory(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Billing History
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;