import React from 'react';
import { Download } from 'lucide-react';

interface BillingRecord {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

const BillingHistory: React.FC = () => {
  const billingHistory: BillingRecord[] = [
    {
      id: '1',
      date: new Date('2024-01-01'),
      amount: 199,
      status: 'paid',
      invoiceUrl: '#'
    },
    {
      id: '2',
      date: new Date('2023-12-01'),
      amount: 199,
      status: 'paid',
      invoiceUrl: '#'
    },
    {
      id: '3',
      date: new Date('2023-11-01'),
      amount: 199,
      status: 'paid',
      invoiceUrl: '#'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {billingHistory.map((record) => (
          <div key={record.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {record.date.toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-500">${record.amount}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                record.status === 'paid' ? 'bg-green-100 text-green-800' :
                record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
              <a
                href={record.invoiceUrl}
                className="text-gray-400 hover:text-gray-500"
                title="Download Invoice"
              >
                <Download className="h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingHistory;