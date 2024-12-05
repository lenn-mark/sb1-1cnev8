import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCarriers } from '../../hooks/useCarriers';

interface TrackShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { trackingNumber: string; carrierId: string; customCarrierName?: string }) => void;
}

const TrackShipmentModal: React.FC<TrackShipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { carriers, addCustomCarrier } = useCarriers();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrierId, setCarrierId] = useState('');
  const [isAddingCarrier, setIsAddingCarrier] = useState(false);
  const [newCarrierName, setNewCarrierName] = useState('');
  const [newCarrierCode, setNewCarrierCode] = useState('');
  const [customCarrierName, setCustomCarrierName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim() && carrierId) {
      onSubmit({
        trackingNumber: trackingNumber.trim(),
        carrierId,
        customCarrierName: carrierId === 'other' ? customCarrierName.trim() : undefined
      });
      setTrackingNumber('');
      setCarrierId('');
      setCustomCarrierName('');
      onClose();
    }
  };

  const handleAddCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCarrierName && newCarrierCode) {
      addCustomCarrier({
        name: newCarrierName,
        code: newCarrierCode.toUpperCase(),
      });
      setNewCarrierName('');
      setNewCarrierCode('');
      setIsAddingCarrier(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Track New Shipment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Carrier
            </label>
            <div className="mt-1 flex items-center gap-2">
              <select
                value={carrierId}
                onChange={(e) => {
                  setCarrierId(e.target.value);
                  if (e.target.value !== 'other') {
                    setCustomCarrierName('');
                  }
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a carrier</option>
                {carriers.map(carrier => (
                  <option key={carrier.id} value={carrier.id}>
                    {carrier.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                onClick={() => setIsAddingCarrier(true)}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Add to carrier list"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {carrierId === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Custom Carrier Name
              </label>
              <input
                type="text"
                value={customCarrierName}
                onChange={(e) => setCustomCarrierName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter carrier name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter tracking number"
              required
            />
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
              Track Shipment
            </button>
          </div>
        </form>

        {isAddingCarrier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Carrier</h3>
                <button 
                  onClick={() => setIsAddingCarrier(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddCarrier} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Carrier Name
                  </label>
                  <input
                    type="text"
                    value={newCarrierName}
                    onChange={(e) => setNewCarrierName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Carrier Code
                  </label>
                  <input
                    type="text"
                    value={newCarrierCode}
                    onChange={(e) => setNewCarrierCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCarrier(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Carrier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackShipmentModal;