import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { Product } from '../../types/product';
import { DropdownMenu } from '../molecules/DropdownMenu';
import { formatDate, formatCurrency, shortId } from '../../utils';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onDelete, isDeleting }) => {
  const navigate = useNavigate();

  const handleRowClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr 
              key={product.id} 
              onClick={() => handleRowClick(product.id)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {shortId(product.id)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.title}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {product.description || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(product.totalPrice)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                {formatCurrency(product.totalDiscount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(product.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu
                  items={[
                    {
                      label: 'View Details',
                      icon: <Eye className="w-4 h-4" />,
                      onClick: () => navigate(`/products/${product.id}`),
                    },
                    {
                      label: 'Edit',
                      icon: <Edit className="w-4 h-4" />,
                      onClick: () => navigate(`/products/${product.id}/edit`),
                    },
                    {
                      label: 'Delete',
                      icon: <Trash2 className="w-4 h-4" />,
                      variant: 'danger',
                      onClick: () => onDelete(product.id),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found. Create your first product!
        </div>
      )}
    </div>
  );
};
