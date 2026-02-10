import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productUpdateSchema } from '../schemas/product.schema';
import { Card, Button, Input, Textarea } from '../components/atoms';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productUpdateSchema),
    values: product ? {
      title: product.title,
      description: product.description || '',
      quantity: product.quantity,
      totalPrice: product.totalPrice,
      totalDiscount: product.totalDiscount,
    } : undefined,
  });

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data });
      navigate(`/products/${id}`);
    } catch (error: any) {
      console.error('Failed to update product:', error);
      alert(error.response?.data?.message || 'Failed to update product. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading product...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update product information
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            required
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            helperText="Optional, max 1000 characters"
          />

          <Input
            label="Quantity"
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
            required
          />

          <Input
            label="Total Price"
            type="number"
            step="0.01"
            {...register('totalPrice', { valueAsNumber: true })}
            error={errors.totalPrice?.message}
            required
          />

          <Input
            label="Total Discount"
            type="number"
            step="0.01"
            {...register('totalDiscount', { valueAsNumber: true })}
            error={errors.totalDiscount?.message}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={updateMutation.isPending}>
              Update Product
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(`/products/${id}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
