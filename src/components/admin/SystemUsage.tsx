import React from 'react';
import { Activity, Server, Database, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemUsage: React.FC = () => {
  // Sample data - in a real app, this would come from your API
  const usageData = [
    { timestamp: '00:00', apiCalls: 2400, cpuUsage: 45, memoryUsage: 60, errorRate: 0.5 },
    { timestamp: '04:00', apiCalls: 1398, cpuUsage: 39, memoryUsage: 55, errorRate: 0.4 },
    { timestamp: '08:00', apiCalls: 9800, cpuUsage: 78, memoryUsage: 75, errorRate: 1.2 },
    { timestamp: '12:00', apiCalls: 3908, cpuUsage: 52, memoryUsage: 62, errorRate: 0.8 },
    { timestamp: '16:00', apiCalls: 4800, cpuUsage: 61, memoryUsage: 68, errorRate: 0.6 },
    { timestamp: '20:00', apiCalls: 3800, cpuUsage: 49, memoryUsage: 58, errorRate: 0.4 },
  ];

  const metrics = [
    {
      name: 'API Requests',
      value: '4.2k/min',
      change: '+5.2%',
      changeType: 'positive',
      icon: Activity,
    },
    {
      name: 'CPU Usage',
      value: '52%',
      change: '-2.1%',
      changeType: 'positive',
      icon: Server,
    },
    {
      name: 'Memory Usage',
      value: '68%',
      change: '+1.5%',
      changeType: 'negative',
      icon: Database,
    },
    {
      name: 'Error Rate',
      value: '0.6%',
      change: '-0.2%',
      changeType: 'positive',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.name}
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">
                          {metric.value}
                        </p>
                        <p
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {metric.change}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">System Metrics (24h)</h3>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              Export Data
            </button>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              View Logs
            </button>
          </div>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="apiCalls" 
                name="API Calls"
                stroke="#4F46E5" 
                fill="#4F46E5" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="cpuUsage" 
                name="CPU Usage (%)"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="memoryUsage" 
                name="Memory Usage (%)"
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="errorRate" 
                name="Error Rate (%)"
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SystemUsage;