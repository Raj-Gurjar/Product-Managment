export interface Product {
  id: string;
  orderId: number;
  title: string;
  description: string | null;
  quantity: number;
  totalPrice: number;
  totalDiscount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductCreateInput {
  orderId: number;
  title: string;
  description?: string;
  quantity: number;
  totalPrice: number;
  totalDiscount: number;
}

export interface ProductUpdateInput {
  title?: string;
  description?: string;
  quantity?: number;
  totalPrice?: number;
  totalDiscount?: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  orderId?: number;
  title?: string;
  sortBy?: 'id' | 'title' | 'quantity' | 'totalPrice' | 'totalDiscount' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
