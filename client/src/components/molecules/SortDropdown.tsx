import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react';
import type { ProductQueryParams } from '../../types/product';

interface SortDropdownProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const sortOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'title', label: 'Title' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'totalPrice', label: 'Total Price' },
  { value: 'totalDiscount', label: 'Total Discount' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
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

  const currentSort = sortOptions.find((opt) => opt.value === sortBy);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ArrowUpDown className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          Sort: {currentSort?.label}
        </span>
        {sortOrder === 'asc' ? (
          <ArrowUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ArrowDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Sort By</p>
          </div>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value, sortOrder);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                sortBy === option.value
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{option.label}</span>
              {sortBy === option.value && <Check className="w-4 h-4" />}
            </button>
          ))}
          
          <div className="border-t border-gray-200 mt-2 pt-2 px-3 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Order</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSortChange(sortBy, 'asc');
                  setIsOpen(false);
                }}
                className={`flex-1 px-3 py-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${
                  sortOrder === 'asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
                Ascending
              </button>
              <button
                onClick={() => {
                  onSortChange(sortBy, 'desc');
                  setIsOpen(false);
                }}
                className={`flex-1 px-3 py-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${
                  sortOrder === 'desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowDown className="w-4 h-4" />
                Descending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
