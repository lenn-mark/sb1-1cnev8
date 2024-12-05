import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp } from 'lucide-react';
import { formatDate } from '../../utils/shipmentUtils';
import { DataTable } from '../ui/DataTable';
import { Shipment } from '../../types/shipment';
import TrackShipmentModal from './TrackShipmentModal';
import CarrierBadge from './CarrierBadge';
import { useTags } from '../../hooks/useTags';
import TagSelector from '../tags/TagSelector';
import TagBadge from '../tags/TagBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ShipmentList: React.FC = () => {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date('2024-01-15'),
    new Date('2024-01-21')
  ]);
  const [startDate, endDate] = dateRange;
  const { tags, createTag, addTagToShipment, removeTagFromShipment, getShipmentTags } = useTags();

  const dailyShipments = [
    { date: '2024-01-15', shipments: 12 },
    { date: '2024-01-16', shipments: 15 },
    { date: '2024-01-17', shipments: 8 },
    { date: '2024-01-18', shipments: 20 },
    { date: '2024-01-19', shipments: 16 },
    { date: '2024-01-20', shipments: 14 },
    { date: '2024-01-21', shipments: 18 }
  ].filter(item => {
    const itemDate = new Date(item.date);
    return (!startDate || itemDate >= startDate) && 
           (!endDate || itemDate <= endDate);
  });

  const handleTrackShipment = (data: { trackingNumber: string; carrierId: string }) => {
    console.log('Tracking shipment:', data);
  };

  const generateShipments = (): Shipment[] => {
    const carriers = ['fedex', 'ups', 'usps', 'dhl'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Boston', 'Denver'];
    const statuses = ['pending', 'in_transit', 'out_for_delivery', 'delivered'];
    
    return Array.from({ length: 40 }, (_, i) => ({
      id: (i + 1).toString(),
      trackingNumber: `SHIP${100000 + i}`,
      carrierId: carriers[Math.floor(Math.random() * carriers.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      origin: {
        city: cities[Math.floor(Math.random() * cities.length)],
        country: 'USA',
        timestamp: new Date(2024, 0, 15 + Math.floor(Math.random() * 7))
      },
      destination: {
        city: cities[Math.floor(Math.random() * cities.length)],
        country: 'USA',
        timestamp: new Date(2024, 0, 20 + Math.floor(Math.random() * 7))
      },
      estimatedDelivery: new Date(2024, 0, 20 + Math.floor(Math.random() * 7)),
      latestDeliveryDate: new Date(2024, 0, 20 + Math.floor(Math.random() * 7)),
      lastUpdate: new Date(2024, 0, 15 + Math.floor(Math.random() * 7)),
      events: []
    }));
  };

  const allShipments = generateShipments();

  const filteredShipments = useMemo(() => {
    return allShipments.filter(shipment => {
      const matchesStatus = !selectedStatus || shipment.status === selectedStatus;
      const shipmentTags = getShipmentTags(shipment.id);
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tagId => shipmentTags.some(tag => tag.id === tagId));
      return matchesStatus && matchesTags;
    });
  }, [allShipments, selectedStatus, selectedTags, getShipmentTags]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-gray-600">
            {payload[0].value} shipments
          </p>
        </div>
      );
    }
    return null;
  };

  const columns = [
    {
      key: 'trackingNumber' as keyof Shipment,
      header: 'Tracking Number',
      sortable: true,
      render: (value: string, item: Shipment) => (
        <div className="space-y-0.5">
          <Link to={`/dashboard/shipments/${item.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: 'carrierId' as keyof Shipment,
      header: 'Carrier',
      render: (value: string, item: Shipment) => (
        <CarrierBadge carrierId={value} trackingNumber={item.trackingNumber} />
      ),
    },
    {
      key: 'status' as keyof Shipment,
      header: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
          value === 'in_transit' ? 'bg-sky-100 text-sky-800' :
          value === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
          'bg-amber-100 text-amber-800'
        }`}>
          {value.replace('_', ' ').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'origin' as keyof Shipment,
      header: 'Origin',
      render: (value: any) => (
        <div className="text-sm text-gray-600">{`${value.city}, ${value.country}`}</div>
      ),
    },
    {
      key: 'destination' as keyof Shipment,
      header: 'Destination',
      render: (value: any) => (
        <div className="text-sm text-gray-600">{`${value.city}, ${value.country}`}</div>
      ),
    },
    {
      key: 'lastUpdate' as keyof Shipment,
      header: 'Last Update',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm text-gray-600">{formatDate(value)}</div>
      ),
    },
    {
      key: 'id' as keyof Shipment,
      header: 'Tags',
      render: (_: any, item: Shipment) => (
        <TagSelector
          availableTags={tags}
          selectedTags={getShipmentTags(item.id)}
          onAddTag={(tagId) => addTagToShipment(item.id, tagId)}
          onRemoveTag={(tagId) => removeTagFromShipment(item.id, tagId)}
          onCreateTag={createTag}
        />
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Active Shipments</h1>
        <button 
          onClick={() => setIsTrackModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Package className="h-4 w-4 mr-2 text-blue-100" />
          Track New Shipment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-medium text-gray-900">Daily Shipments</h2>
          </div>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select date range"
            dateFormat="MMM dd, yyyy"
          />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyShipments} barSize={16}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dx={-8}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar 
                dataKey="shipments" 
                fill="#818CF8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag.id)
                        ? prev.filter(id => id !== tag.id)
                        : [...prev, tag.id]
                    );
                  }}
                  className={`transition-all ${
                    selectedTags.includes(tag.id) ? 'ring-2 ring-offset-2' : ''
                  }`}
                >
                  <TagBadge tag={tag} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredShipments}
        columns={columns}
        searchable={true}
        searchKeys={['trackingNumber', 'status']}
        itemsPerPage={10}
      />

      <TrackShipmentModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onSubmit={handleTrackShipment}
      />
    </div>
  );
};

export default ShipmentList;