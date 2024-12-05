import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AlarmCondition } from '../../services/alarms/types';

interface CreateAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    trackingNumber?: string;
    conditions: AlarmCondition[];
    scope: 'global' | 'specific';
  }) => void;
}

const CreateAlarmModal: React.FC<CreateAlarmModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState<'global' | 'specific'>('specific');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [maxDays, setMaxDays] = useState('3');
  const [keywords, setKeywords] = useState('');
  const [status, setStatus] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [latestDeliveryDate, setLatestDeliveryDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const conditions: AlarmCondition[] = [];

    if (maxDays) {
      conditions.push({
        type: 'transit_time',
        params: { maxDays: parseInt(maxDays) }
      });
    }

    if (keywords) {
      conditions.push({
        type: 'description_match',
        params: { keywords: keywords.split(',').map(k => k.trim()) }
      });
    }

    if (status && durationHours) {
      conditions.push({
        type: 'status_duration',
        params: { 
          status,
          durationHours: parseInt(durationHours)
        }
      });
    }

    if (latestDeliveryDate) {
      conditions.push({
        type: 'delivery_date',
        params: { latestDeliveryDate: new Date(latestDeliveryDate) }
      });
    }

    onSubmit({
      name,
      scope,
      trackingNumber: scope === 'specific' ? trackingNumber : undefined,
      conditions
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Alarm</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alarm Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="e.g., Long Transit Time Alert"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alarm Scope
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as 'global' | 'specific')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="global">Global (All Shipments)</option>
              <option value="specific">Specific Tracking Number</option>
            </select>
          </div>

          {scope === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Transit Days
            </label>
            <input
              type="number"
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latest Delivery Date
            </label>
            <input
              type="date"
              value={latestDeliveryDate}
              onChange={(e) => setLatestDeliveryDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alert Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="damaged, lost, delayed"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Duration Alert
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                placeholder="Hours"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlarmModal;