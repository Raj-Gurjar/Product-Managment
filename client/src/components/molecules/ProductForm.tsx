import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { Input, Textarea, Button } from '../atoms';
import { productCreateSchema, type ProductCreateFormData } from '../../schemas/product.schema';

interface ProductFormProps {
  onSubmit: (data: ProductCreateFormData) => void;
  initialData?: Partial<ProductCreateFormData>;
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitLabel = 'Submit',
  onCancel,
  onDelete,
  isDeleting = false,
  isEdit = false,
}) => {
  const [unitPrice, setUnitPrice] = useState<number>(() => {
    if (initialData?.totalPrice && initialData?.quantity) {
      return initialData.totalPrice / initialData.quantity;
    }
    return 0;
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductCreateFormData>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: initialData,
  });

  const quantity = watch('quantity');

  // Update total price when quantity or unit price changes
  useEffect(() => {
    if (quantity && unitPrice) {
      const total = Number((quantity * unitPrice).toFixed(2));
      setValue('totalPrice', total, { shouldValidate: true });
    }
  }, [quantity, unitPrice, setValue]);

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setUnitPrice(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isEdit && (
        <Input
          label="Order ID"
          type="number"
          {...register('orderId', { valueAsNumber: true })}
          error={errors.orderId?.message}
          required
        />
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
          required
        />

        <Input
          label="Unit Price"
          type="number"
          step="0.01"
          value={unitPrice}
          onChange={handleUnitPriceChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Total Price"
          type="number"
          step="0.01"
          {...register('totalPrice', { valueAsNumber: true })}
          error={errors.totalPrice?.message}
          required
          readOnly
          className="bg-gray-50 cursor-not-allowed"
          helperText="Calculated: Qty × Unit Price"
        />

        <Input
          label="Total Discount"
          type="number"
          step="0.01"
          {...register('totalDiscount', { valueAsNumber: true })}
          error={errors.totalDiscount?.message}
          required
        />
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
        <div className="flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        
        {onDelete && (
          <Button 
            type="button" 
            variant="danger" 
            onClick={onDelete} 
            isLoading={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};
