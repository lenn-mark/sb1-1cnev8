import React from 'react';
import { X } from 'lucide-react';
import { Tag } from '../../types/tag';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  selected?: boolean;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, onRemove, selected }) => {
  const baseColor = tag.color;
  const backgroundColor = selected 
    ? `${baseColor}40`  // 25% opacity for selected
    : `${baseColor}20`; // 12.5% opacity for unselected

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 transition-colors duration-200 ${
        selected ? 'ring-2 ring-offset-2' : ''
      }`}
      style={{
        backgroundColor,
        color: tag.color
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default TagBadge;