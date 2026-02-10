import { apiClient } from './client';
import type { 
  Product, 
  ProductCreateInput, 
  ProductUpdateInput, 
  ProductListResponse, 
  ProductQueryParams 
} from '../types/product';

export const productApi = {
  getAll: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: ProductCreateInput): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: ProductUpdateInput): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  softDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  restore: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}/restore`);
    return response.data;
  },

  restoreAll: async (): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post<{ message: string; count: number }>('/products/restore-all');
    return response.data;
  },
};
