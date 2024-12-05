import { useState } from 'react';
import { Tag, ShipmentTag } from '../types/tag';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([
    {
      id: '1',
      name: 'Priority',
      color: '#EF4444', // red
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Fragile',
      color: '#F59E0B', // yellow
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'International',
      color: '#3B82F6', // blue
      createdAt: new Date()
    }
  ]);

  const [shipmentTags, setShipmentTags] = useState<ShipmentTag[]>([
    { shipmentId: '1', tagId: '1' },
    { shipmentId: '1', tagId: '2' }
  ]);

  const createTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: (tags.length + 1).toString(),
      name,
      color,
      createdAt: new Date()
    };
    setTags([...tags, newTag]);
    return newTag;
  };

  const deleteTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
    setShipmentTags(shipmentTags.filter(st => st.tagId !== tagId));
  };

  const addTagToShipment = (shipmentId: string, tagId: string) => {
    if (!shipmentTags.some(st => st.shipmentId === shipmentId && st.tagId === tagId)) {
      setShipmentTags([...shipmentTags, { shipmentId, tagId }]);
    }
  };

  const removeTagFromShipment = (shipmentId: string, tagId: string) => {
    setShipmentTags(shipmentTags.filter(
      st => !(st.shipmentId === shipmentId && st.tagId === tagId)
    ));
  };

  const getShipmentTags = (shipmentId: string): Tag[] => {
    const tagIds = shipmentTags
      .filter(st => st.shipmentId === shipmentId)
      .map(st => st.tagId);
    return tags.filter(tag => tagIds.includes(tag.id));
  };

  const getTagById = (tagId: string): Tag | undefined => {
    return tags.find(tag => tag.id === tagId);
  };

  return {
    tags,
    createTag,
    deleteTag,
    addTagToShipment,
    removeTagFromShipment,
    getShipmentTags,
    getTagById
  };
};