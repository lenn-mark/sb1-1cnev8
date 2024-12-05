import React, { useState } from 'react';
import { Plus, Tag as TagIcon } from 'lucide-react';
import { Tag } from '../../types/tag';
import TagBadge from './TagBadge';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
  onCreateTag?: (name: string, color: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onAddTag,
  onRemoveTag,
  onCreateTag
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName && onCreateTag) {
      onCreateTag(newTagName, newTagColor);
      setNewTagName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={() => onRemoveTag(tag.id)}
          />
        ))}
      </div>

      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <select
              className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onAddTag(e.target.value)}
              value=""
            >
              <option value="" disabled>Add a tag...</option>
              {availableTags
                .filter(tag => !selectedTags.some(st => st.id === tag.id))
                .map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
            <TagIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {onCreateTag && (
            <button
              onClick={() => setIsCreating(true)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {isCreating && onCreateTag && (
        <form onSubmit={handleCreateTag} className="mt-2 space-y-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="h-8 w-8 rounded cursor-pointer"
            />
            <div className="flex-1 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TagSelector;