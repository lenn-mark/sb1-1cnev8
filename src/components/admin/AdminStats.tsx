import React from 'react';
import { Users, CreditCard, Activity, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminStats: React.FC = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users
    },
    {
      name: 'Active Subscriptions',
      value: '2,312',
      change: '+8.2%',
      changeType: 'positive',
      icon: CreditCard
    },
    {
      name: 'API Usage',
      value: '1.2M',
      change: '+23.1%',
      changeType: 'positive',
      icon: Activity
    },
    {
      name: 'System Alerts',
      value: '2',
      change: '-1',
      changeType: 'negative',
      icon: AlertTriangle
    }
  ];

  const chartData = [
    { date: '2024-01-01', users: 2700, subscriptions: 2200, apiCalls: 980000 },
    { date: '2024-01-07', users: 2750, subscriptions: 2240, apiCalls: 1050000 },
    { date: '2024-01-14', users: 2800, subscriptions: 2280, apiCalls: 1120000 },
    { date: '2024-01-21', users: 2847, subscriptions: 2312, apiCalls: 1200000 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </p>
                        <p
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
              <Area type="monotone" dataKey="subscriptions" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              <Area type="monotone" dataKey="apiCalls" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;