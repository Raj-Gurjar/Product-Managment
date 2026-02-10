import React from 'react';
import { Filter, X } from 'lucide-react';
import { Input, Button } from '../atoms';
import type { ProductQueryParams } from '../../types/product';

interface ProductFiltersProps {
  filters: ProductQueryParams;
  onFilterChange: (filters: ProductQueryParams) => void;
  onClearFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = filters.orderId !== undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Filters & Sorting</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Order ID"
          type="number"
          placeholder="Filter by Order ID"
          value={filters.orderId || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              orderId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="title">Title</option>
            <option value="quantity">Quantity</option>
            <option value="totalPrice">Total Price</option>
            <option value="totalDiscount">Total Discount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortOrder: e.target.value as 'asc' | 'desc',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};
