import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { useProducts, useDeleteProduct, useRestoreAllProducts, useUpdateProduct, useCreateProduct } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { ProductTable } from '../components/organisms/ProductTable';
import { ProductDetail } from '../components/organisms/ProductDetail';
import { ProductForm } from '../components/molecules/ProductForm';
import { SearchBar } from '../components/molecules/SearchBar';
import { SortDropdown } from '../components/molecules/SortDropdown';
import { FilterDropdown } from '../components/molecules/FilterDropdown';
import { Button, Card, Modal } from '../components/atoms';
import type { ProductQueryParams, Product } from '../types/product';

export const ProductsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState<ProductQueryParams>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, error } = useProducts({ ...filters, page, limit });
  const deleteMutation = useDeleteProduct();
  const restoreAllMutation = useRestoreAllProducts();
  const updateMutation = useUpdateProduct();
  const createMutation = useCreateProduct();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteMutation.mutateAsync(id);
        if (selectedProduct?.id === id) {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleRestoreAll = async () => {
    if (window.confirm('Are you sure you want to restore all deleted products?')) {
      try {
        const result = await restoreAllMutation.mutateAsync();
        alert(result.message);
      } catch (error) {
        console.error('Failed to restore products:', error);
        alert('Failed to restore products. Please try again.');
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState(filters.title || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Sync debounced search term with filters
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      title: debouncedSearchTerm || undefined,
    }));
    setPage(1);
  }, [debouncedSearchTerm]);

  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters({
      ...filters,
      sortBy: sortBy as any,
      sortOrder,
    });
    setPage(1);
  };

  const handleOrderIdChange = (orderId: number | undefined) => {
    setFilters({
      ...filters,
      orderId,
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      ...filters,
      orderId: undefined,
    });
    setPage(1);
  };

  const hasActiveFilters = filters.orderId !== undefined;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(false);
  };
  
  const handleUpdateProduct = async (formData: any) => {
    if (!selectedProduct) return;
    try {
      // Strip orderId as it's not allowed in the Update DTO (whitelisted)
      const { orderId, ...updateData } = formData;
      await updateMutation.mutateAsync({ id: selectedProduct.id, data: updateData });
      setIsEditing(false);
      setSelectedProduct(null); // Close modal on success
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCreateProduct = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={handleRestoreAll}
            isLoading={restoreAllMutation.isPending}
          >
            <RotateCcw className="w-4 h-4" />
            Restore All
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search products by title..."
          />
        </div>
        <div className="flex gap-3">
          <FilterDropdown
            orderId={filters.orderId}
            onOrderIdChange={handleOrderIdChange}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
          <SortDropdown
            sortBy={filters.sortBy || 'createdAt'}
            sortOrder={filters.sortOrder || 'desc'}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Results Summary */}
      {data && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{data.data.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{data.meta.total}</span> products
            {(filters.orderId || filters.title) && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Filtered
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding="none">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <ProductTable
            products={data?.data || []}
            onRowClick={handleProductClick}
          />
        )}
      </Card>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page <span className="font-semibold">{data.meta.page}</span> of{' '}
            <span className="font-semibold">{data.meta.totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Product Create/Edit/Detail Modal */}
      {(selectedProduct || isCreating) && (
        <Modal
          isOpen={!!selectedProduct || isCreating}
          onClose={() => {
            setSelectedProduct(null);
            setIsEditing(false);
            setIsCreating(false);
          }}
          title={isCreating ? 'Create Product' : isEditing ? 'Edit Product' : 'Product Details'}
        >
          {isCreating ? (
            <ProductForm
              key="create"
              onSubmit={handleCreateProduct}
              isLoading={createMutation.isPending}
              submitLabel="Create Product"
              onCancel={() => setIsCreating(false)}
            />
          ) : selectedProduct ? (
            isEditing ? (
              <ProductForm
                key={selectedProduct.id}
                initialData={{
                  ...selectedProduct,
                  description: selectedProduct.description ?? undefined
                } as any}
                onSubmit={handleUpdateProduct}
                isLoading={updateMutation.isPending}
                submitLabel="Update Product"
                onCancel={() => setIsEditing(false)}
                onDelete={() => handleDelete(selectedProduct.id)}
                isDeleting={deleteMutation.isPending}
                isEdit={true}
              />
            ) : (
              <ProductDetail
                product={selectedProduct}
                onDelete={() => handleDelete(selectedProduct.id)}
                isDeleting={deleteMutation.isPending}
                onBack={() => setSelectedProduct(null)}
                onEdit={() => setIsEditing(true)}
              />
            )
          ) : null}
        </Modal>
      )}
    </div>
  );
};
