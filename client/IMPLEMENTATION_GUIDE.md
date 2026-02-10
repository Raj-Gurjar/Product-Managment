# 🚀 Frontend Implementation Guide

## ✅ What's Been Set Up

### 1. **Dependencies Installed**
```json
{
  "@tanstack/react-query": "Latest",
  "@tanstack/react-query-devtools": "Latest",
  "react-hook-form": "Latest",
  "@hookform/resolvers": "Latest",
  "zod": "Latest",
  "axios": "Latest",
  "tailwindcss": "Latest"
}
```

### 2. **Project Structure Created**

```
src/
├── api/
│   ├── client.ts              ✅ Axios instance with interceptors
│   └── products.ts            ✅ All product API methods
├── components/
│   ├── atoms/                 ✅ Button, Input, Textarea, Card, Badge
│   └── molecules/             ✅ ProductForm
├── hooks/
│   └── useProducts.ts         ✅ React Query hooks for all operations
├── schemas/
│   └── product.schema.ts      ✅ Zod validation schemas
├── types/
│   └── product.ts             ✅ TypeScript interfaces
└── App.tsx                    ✅ Main app with React Query setup
```

### 3. **Configuration Files**
- ✅ `tailwind.config.js` - Tailwind configuration
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `.env` - Environment variables
- ✅ `index.css` - Tailwind directives + custom classes

## 🎯 Next Steps to Complete the UI

### Step 1: Create Remaining Molecules

Create `src/components/molecules/ProductCard.tsx`:
```tsx
import { Card, Badge, Button } from '../atoms';
import type { Product } from '../../types/product';

export const ProductCard = ({ product, onEdit, onDelete }: Props) => {
  return (
    <Card>
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <div>Price: ${product.totalPrice}</div>
      <Button onClick={() => onEdit(product.id)}>Edit</Button>
      <Button variant="danger" onClick={() => onDelete(product.id)}>Delete</Button>
    </Card>
  );
};
```

### Step 2: Create Organisms

Create `src/components/organisms/ProductTable.tsx`:
```tsx
import { useProducts } from '../../hooks/useProducts';
import { Button } from '../atoms';

export const ProductTable = () => {
  const { data, isLoading } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Order ID</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data?.data.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.title}</td>
            {/* ... other columns */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### Step 3: Create Pages

Create `src/pages/ProductsPage.tsx`:
```tsx
import { useState } from 'react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { ProductTable } from '../components/organisms/ProductTable';
import { Button } from '../components/atoms';

export const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, limit: 10 });
  const deleteMutation = useDeleteProduct();

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => navigate('/products/new')}>
          Create Product
        </Button>
      </div>
      
      <ProductTable 
        products={data?.data}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      
      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        <Button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </Button>
        <Button 
          disabled={page >= (data?.meta.totalPages || 1)}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
```

Create `src/pages/CreateProductPage.tsx`:
```tsx
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useProducts';
import { ProductForm } from '../components/molecules/ProductForm';
import { Card } from '../components/atoms';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    navigate('/products');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
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
```

### Step 4: Add Routing

Install React Router (if not already):
```bash
npm install react-router-dom
```

Update `App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

// Inside App component:
<BrowserRouter>
  <Routes>
    <Route path="/" element={<ProductsPage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/new" element={<CreateProductPage />} />
    <Route path="/products/:id" element={<ProductDetailPage />} />
    <Route path="/products/:id/edit" element={<EditProductPage />} />
  </Routes>
</BrowserRouter>
```

## 🎨 Styling Tips

### Use Tailwind Utility Classes
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <Button>Action</Button>
</div>
```

### Use Custom Component Classes (from index.css)
```tsx
<button className="btn btn-primary">Click Me</button>
<input className="input" />
<div className="card p-6">Content</div>
```

## 🔧 React Query Patterns

### Query with Parameters
```tsx
const [filters, setFilters] = useState({ page: 1, title: '' });
const { data } = useProducts(filters);
```

### Mutation with Success Handler
```tsx
const mutation = useCreateProduct();

mutation.mutate(data, {
  onSuccess: () => {
    toast.success('Product created!');
    navigate('/products');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Optimistic Updates
```tsx
const updateMutation = useUpdateProduct();

updateMutation.mutate({ id, data }, {
  onMutate: async ({ id, data }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: PRODUCT_KEYS.detail(id) });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(PRODUCT_KEYS.detail(id));
    
    // Optimistically update
    queryClient.setQueryData(PRODUCT_KEYS.detail(id), old => ({ ...old, ...data }));
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(PRODUCT_KEYS.detail(id), context.previous);
  },
});
```

## 📋 Form Validation Examples

### Custom Validation Rules
```tsx
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(100),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

## 🚀 Running the App

1. **Start Backend** (in server directory):
   ```bash
   npm run start:dev
   ```

2. **Start Frontend** (in client directory):
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🎯 Testing the Setup

1. Open React Query Devtools (bottom-left icon)
2. Check network tab for API calls
3. Test form validation by submitting empty form
4. Verify Tailwind styles are applied

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

Happy coding! 🎉
