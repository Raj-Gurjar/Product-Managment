# Product Management Frontend

## 🏗️ Architecture Overview

This frontend follows **Atomic Design** principles with modern React best practices.

### Tech Stack
- ⚛️ **React 19** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 🔄 **React Query** for server state management
- 📝 **React Hook Form** for form handling
- ✅ **Zod** for schema validation
- 🌐 **Axios** for API calls
- 🧭 **React Router** for navigation

## 📁 Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.ts          # Axios instance
│   └── products.ts        # Product API methods
├── components/            # Atomic Design components
│   ├── atoms/            # Basic building blocks
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── molecules/        # Combinations of atoms
│   │   ├── ProductForm.tsx
│   │   └── ProductCard.tsx
│   ├── organisms/        # Complex components
│   │   ├── ProductTable.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ProductList.tsx
│   └── templates/        # Page layouts
│       └── MainLayout.tsx
├── hooks/                # Custom React hooks
│   └── useProducts.ts    # React Query hooks
├── pages/                # Route pages
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CreateProductPage.tsx
│   └── EditProductPage.tsx
├── schemas/              # Zod validation schemas
│   └── product.schema.ts
├── types/                # TypeScript types
│   └── product.ts
└── utils/                # Utility functions

```

## 🎨 Atomic Design Breakdown

### Atoms (Basic UI Elements)
- **Button**: Primary, secondary, danger, ghost variants with loading state
- **Input**: Text input with label, error, and helper text
- **Textarea**: Multi-line input
- **Card**: Container with shadow and border
- **Badge**: Status indicators

### Molecules (Simple Components)
- **ProductForm**: Form with validation for create/edit
- **ProductCard**: Product display card
- **SearchBar**: Search and filter controls

### Organisms (Complex Components)
- **ProductTable**: Full table with sorting, pagination
- **ProductDetail**: Complete product view with actions
- **ProductList**: Grid/list view of products

### Templates (Page Layouts)
- **MainLayout**: Header, sidebar, content area

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```

## 📝 Key Features Implemented

### ✅ Table View
- Columns: id, title, description, orderId, quantity, totalPrice, totalDiscount, createdAt
- Sorting by any column
- Pagination
- Search and filters

### ✅ Create/Edit Form
- All editable fields with validation
- Real-time validation with Zod
- Error messages
- Loading states

### ✅ Detail View
- Full product information
- Audit metadata (createdAt, updatedAt, deletedAt)
- Edit and delete actions

### ✅ Business Rules
- Title required
- Description optional (max 1000 chars)
- totalDiscount cannot exceed totalPrice
- Soft delete only (no hard delete)

## 🔧 React Query Usage

### Queries
```typescript
const { data, isLoading, error } = useProducts({ page: 1, limit: 10 });
const { data: product } = useProduct(id);
```

### Mutations
```typescript
const createMutation = useCreateProduct();
const updateMutation = useUpdateProduct();
const deleteMutation = useDeleteProduct();
const restoreMutation = useRestoreProduct();
```

## 📋 Form Validation

All forms use **Zod schemas** with **React Hook Form**:

```typescript
const schema = z.object({
  title: z.string().min(1, 'Required'),
  totalPrice: z.number().min(0),
  totalDiscount: z.number().min(0),
}).refine(data => data.totalDiscount <= data.totalPrice);
```

## 🎯 Next Steps

1. Run the dev server: `npm run dev`
2. The app will be available at `http://localhost:5173`
3. Make sure the backend is running on `http://localhost:3000`

## 📚 Component Usage Examples

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

### Input
```tsx
<Input 
  label="Product Title"
  error={errors.title?.message}
  {...register('title')}
/>
```

### ProductForm
```tsx
<ProductForm
  onSubmit={handleSubmit}
  isLoading={isLoading}
  submitLabel="Create Product"
/>
```

## 🔍 API Integration

All API calls go through React Query hooks:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

Happy coding! 🎉
