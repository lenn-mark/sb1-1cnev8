import React, { useState } from 'react';
import { useAlarms } from '../../hooks/useAlarms';
import { useTags } from '../../hooks/useTags';
import AlarmTriggeredShipments from '../../components/dashboard/AlarmTriggeredShipments';
import TagBadge from '../../components/tags/TagBadge';

const TriggeredShipmentsPage: React.FC = () => {
  const { triggeredShipments, removeTriggeredShipment } = useAlarms();
  const { tags, getShipmentTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagFilter = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredTriggeredShipments = Object.entries(triggeredShipments)
    .map(([alarmId, data]) => ({
      alarmId,
      alarm: data.alarm,
      shipments: selectedTags.length > 0
        ? data.shipments.filter(shipment =>
            getShipmentTags(shipment.id).some(tag =>
              selectedTags.includes(tag.id)
            )
          )
        : data.shipments
    }))
    .filter(({ shipments }) => shipments.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Triggered Shipments</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagFilter(tag.id)}
              className={`transition-all ${
                selectedTags.includes(tag.id) ? 'ring-2 ring-offset-2' : ''
              }`}
            >
              <TagBadge tag={tag} />
            </button>
          ))}
        </div>
      </div>

      {filteredTriggeredShipments.map(({ alarmId, alarm, shipments }) => (
        <AlarmTriggeredShipments
          key={alarmId}
          alarm={alarm}
          shipments={shipments}
          onRemoveShipment={(shipmentId) => removeTriggeredShipment(alarmId, shipmentId)}
        />
      ))}

      {filteredTriggeredShipments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No shipments match the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default TriggeredShipmentsPage;