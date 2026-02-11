import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import type { Product } from '../../types/product';
import { Card, Button, Badge } from '../atoms';
import { formatDateDetailed, formatCurrency } from '../../utils';

interface ProductDetailProps {
  product: Product;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onDelete, isDeleting }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-1 text-sm text-gray-500">Product ID: {product.id}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/products/${product.id}/edit`)}>
            <Edit className="w-4 h-4" />
            Edit Product
          </Button>
          <Button variant="danger" onClick={onDelete} isLoading={isDeleting}>
            <Trash2 className="w-4 h-4" />
            Delete Product
          </Button>
        </div>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Order ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.orderId}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Quantity</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.quantity} units</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Price</dt>
            <dd className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(product.totalPrice)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Discount</dt>
            <dd className="mt-1 text-sm font-semibold text-green-600">{formatCurrency(product.totalDiscount)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {product.description || <span className="text-gray-400 italic">No description provided</span>}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Information</h2>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDateDetailed(product.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDateDetailed(product.updatedAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              {product.deletedAt ? (
                <Badge variant="danger">Deleted on {formatDateDetailed(product.deletedAt)}</Badge>
              ) : (
                <Badge variant="success">Active</Badge>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      <div>
        <Button variant="ghost" onClick={() => navigate('/products')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>
    </div>
  );
};
