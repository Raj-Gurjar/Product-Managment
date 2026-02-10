import { z } from 'zod';

export const productCreateSchema = z.object({
  orderId: z.number().int().min(1, 'Order ID must be at least 1'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  totalPrice: z.number().min(0, 'Total price must be non-negative'),
  totalDiscount: z.number().min(0, 'Total discount must be non-negative'),
}).refine((data) => data.totalDiscount <= data.totalPrice, {
  message: 'Total discount cannot exceed total price',
  path: ['totalDiscount'],
});

export const productUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').optional(),
  totalPrice: z.number().min(0, 'Total price must be non-negative').optional(),
  totalDiscount: z.number().min(0, 'Total discount must be non-negative').optional(),
}).refine((data) => {
  if (data.totalDiscount !== undefined && data.totalPrice !== undefined) {
    return data.totalDiscount <= data.totalPrice;
  }
  return true;
}, {
  message: 'Total discount cannot exceed total price',
  path: ['totalDiscount'],
});

export type ProductCreateFormData = z.infer<typeof productCreateSchema>;
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;
