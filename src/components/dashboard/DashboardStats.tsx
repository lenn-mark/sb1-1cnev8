import React from 'react';
import { Package, Bell, Clock, AlertTriangle } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const stats = [
    {
      name: 'Active Shipments',
      value: '12',
      icon: Package,
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      name: 'Active Alarms',
      value: '4',
      icon: Bell,
      change: '-1',
      changeType: 'neutral'
    },
    {
      name: 'Average Transit Time',
      value: '3.2 days',
      icon: Clock,
      change: '-0.5 days',
      changeType: 'positive'
    },
    {
      name: 'Delayed Shipments',
      value: '1',
      icon: AlertTriangle,
      change: '+1',
      changeType: 'negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className="absolute bg-blue-500 rounded-md p-3">
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'negative' ? 'text-red-600' :
                'text-gray-500'
              }`}
            >
              {stat.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;