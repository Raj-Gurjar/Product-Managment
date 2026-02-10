import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useProducts';
import { ProductForm } from '../components/molecules/ProductForm';
import { Card } from '../components/atoms';

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      navigate('/products');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      alert(error.response?.data?.message || 'Failed to create product. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new product to your inventory
        </p>
      </div>

      <Card>
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Create Product"
        />
      </Card>
    </div>
  );
};
