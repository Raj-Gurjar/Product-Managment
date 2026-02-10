import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea, Button } from '../atoms';
import { productCreateSchema, type ProductCreateFormData } from '../../schemas/product.schema';

interface ProductFormProps {
  onSubmit: (data: ProductCreateFormData) => void;
  defaultValues?: Partial<ProductCreateFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitLabel = 'Submit',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductCreateFormData>({
    resolver: zodResolver(productCreateSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Order ID"
        type="number"
        {...register('orderId', { valueAsNumber: true })}
        error={errors.orderId?.message}
        required
      />

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
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
