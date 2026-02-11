import React, { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Input, Button } from '../atoms';

interface FilterDropdownProps {
  orderId?: number;
  onOrderIdChange: (orderId: number | undefined) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  orderId,
  onOrderIdChange,
  hasActiveFilters,
  onClearFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors cursor-pointer ${
          hasActiveFilters
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              1
            </span>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-10">
          <div className="px-4 pb-3 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Filter Products</p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  onClearFilters();
                  setIsOpen(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="px-4 pt-3">
            <Input
              label="Order ID"
              type="number"
              placeholder="Filter by Order ID"
              value={orderId || ''}
              onChange={(e) =>
                onOrderIdChange(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          <div className="px-4 pt-3 border-t border-gray-200 mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
