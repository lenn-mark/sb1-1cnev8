import React, { useState } from 'react';
import { Bell, AlertTriangle, X, Globe } from 'lucide-react';
import { AlarmCondition } from '../../services/alarms/types';
import CreateAlarmModal from './CreateAlarmModal';
import ConfirmDialog from '../ui/ConfirmDialog';

const AlarmsList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [alarmToDelete, setAlarmToDelete] = useState<string | null>(null);
  const [alarms] = useState([
    {
      id: '1',
      trackingNumber: 'SHIP123456',
      conditions: [
        {
          type: 'transit_time',
          params: { maxDays: 5 }
        } as AlarmCondition,
        {
          type: 'description_match',
          params: { keywords: ['damaged', 'lost'] }
        } as AlarmCondition
      ],
      active: true,
      createdAt: new Date('2024-01-10')
    }
  ]);

  const handleCreateAlarm = (data: any) => {
    console.log('Creating alarm:', data);
    setIsCreateModalOpen(false);
  };

  const handleDeleteAlarm = (alarmId: string) => {
    setAlarmToDelete(alarmId);
  };

  const confirmDeleteAlarm = () => {
    // Handle alarm deletion
    console.log('Deleting alarm:', alarmToDelete);
    setAlarmToDelete(null);
  };

  const renderCondition = (condition: AlarmCondition) => {
    switch (condition.type) {
      case 'transit_time':
        return `Transit time exceeds ${condition.params.maxDays} days`;
      case 'status_duration':
        return `Status "${condition.params.status}" for ${condition.params.durationHours}h`;
      case 'description_match':
        return `Contains keywords: ${condition.params.keywords?.join(', ')}`;
      default:
        return 'Unknown condition';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tracking Alarms</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create New Alarm
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Active Alarms</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {alarms.map((alarm) => (
            <div key={alarm.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {alarm.trackingNumber ? (
                    <Bell className="h-5 w-5 text-blue-500 mr-3" />
                  ) : (
                    <Globe className="h-5 w-5 text-green-500 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alarm.trackingNumber ? `Tracking: ${alarm.trackingNumber}` : 'Global Alarm'}
                    </p>
                    <div className="mt-2 space-y-1">
                      {alarm.conditions.map((condition, index) => (
                        <p key={index} className="text-sm text-gray-500 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-gray-400 mr-2" />
                          {renderCondition(condition)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteAlarm(alarm.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateAlarmModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAlarm}
      />

      <ConfirmDialog
        isOpen={!!alarmToDelete}
        title="Delete Alarm"
        message="Are you sure you want to delete this alarm? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAlarm}
        onCancel={() => setAlarmToDelete(null)}
      />
    </div>
  );
};

export default AlarmsList;