# Product API - cURL Commands

## Base URL
```
http://localhost:3000
```

---

## 1. Create Product

### Basic Create
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "title": "Sample Product",
    "description": "A sample product description",
    "quantity": 5,
    "totalPrice": 100.00,
    "totalDiscount": 10.00
  }'
```

### Create Without Description (Optional Field)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "title": "Product Without Description",
    "quantity": 3,
    "totalPrice": 50.00,
    "totalDiscount": 5.00
  }'
```

### Validation Test - Discount Exceeds Price (Should Fail)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "title": "Invalid Product",
    "quantity": 5,
    "totalPrice": 50.00,
    "totalDiscount": 100.00
  }'
```

### Validation Test - Empty Title (Should Fail)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "title": "",
    "quantity": 5,
    "totalPrice": 50.00,
    "totalDiscount": 10.00
  }'
```

### Validation Test - Zero Quantity (Should Fail)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "title": "Invalid Quantity Product",
    "quantity": 0,
    "totalPrice": 50.00,
    "totalDiscount": 10.00
  }'
```

---

## 2. List Products

### Basic List (All Active Products)
```bash
curl "http://localhost:3000/products"
```

### Filter by Order ID
```bash
curl "http://localhost:3000/products?orderId=1"
```

### Filter by Title (Partial Match, Case-Insensitive)
```bash
curl "http://localhost:3000/products?title=Sample"
```

### Sort by Price (Ascending)
```bash
curl "http://localhost:3000/products?sortBy=totalPrice&sortOrder=asc"
```

### Sort by Price (Descending)
```bash
curl "http://localhost:3000/products?sortBy=totalPrice&sortOrder=desc"
```

### Sort by Created Date (Newest First)
```bash
curl "http://localhost:3000/products?sortBy=createdAt&sortOrder=desc"
```

### Sort by Quantity
```bash
curl "http://localhost:3000/products?sortBy=quantity&sortOrder=asc"
```

### Pagination - Page 1, 5 Items
```bash
curl "http://localhost:3000/products?page=1&limit=5"
```

### Pagination - Page 2, 10 Items
```bash
curl "http://localhost:3000/products?page=2&limit=10"
```

### Combined - Filter + Sort + Pagination
```bash
curl "http://localhost:3000/products?orderId=1&sortBy=createdAt&sortOrder=desc&page=1&limit=10"
```

### Combined - Title Filter + Price Sort
```bash
curl "http://localhost:3000/products?title=Product&sortBy=totalPrice&sortOrder=asc&page=1&limit=20"
```

---

## 3. View Product Details

### Get Single Product by ID
```bash
curl "http://localhost:3000/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## 4. Update Product

### Update All Editable Fields
```bash
curl -X PATCH http://localhost:3000/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Product Title",
    "description": "Updated description",
    "quantity": 10,
    "totalPrice": 200.00,
    "totalDiscount": 20.00
  }'
```

### Update Only Title
```bash
curl -X PATCH http://localhost:3000/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Title Only"
  }'
```

### Update Price and Discount
```bash
curl -X PATCH http://localhost:3000/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "totalPrice": 150.00,
    "totalDiscount": 15.00
  }'
```

---

## 5. Soft Delete Product

### Delete Product (Sets deletedAt timestamp)
```bash
curl -X DELETE http://localhost:3000/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Note:** Returns `204 No Content` on success

---

## 6. Restore Deleted Product

### Restore a Soft-Deleted Product
```bash
curl -X PATCH http://localhost:3000/products/a1b2c3d4-e5f6-7890-abcd-ef1234567890/restore
```

---

## 7. Restore All Deleted Products

### Restore All Soft-Deleted Products (Bulk Operation)
```bash
curl -X POST http://localhost:3000/products/restore-all
```

**Response:**
```json
{
  "message": "Successfully restored 5 product(s)",
  "count": 5
}
```

**Note:** If no deleted products exist, returns `count: 0`

---

## Response Format

### Create Product Response
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "orderId": 1,
  "title": "Sample Product",
  "description": "A sample product description",
  "quantity": 5,
  "totalPrice": 100,
  "totalDiscount": 10,
  "createdAt": "2026-02-09T15:30:00.000Z",
  "updatedAt": "2026-02-09T15:30:00.000Z",
  "deletedAt": null
}
```

### View Product Details Response
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "orderId": 1,
  "title": "Sample Product",
  "description": "A sample product description",
  "quantity": 5,
  "totalPrice": 100,
  "totalDiscount": 10,
  "createdAt": "2026-02-09T15:30:00.000Z",
  "updatedAt": "2026-02-09T15:30:00.000Z",
  "deletedAt": null
}
```

### Update Product Response
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "orderId": 1,
  "title": "Updated Product Title",
  "description": "Updated description",
  "quantity": 10,
  "totalPrice": 200,
  "totalDiscount": 20,
  "createdAt": "2026-02-09T15:30:00.000Z",
  "updatedAt": "2026-02-10T14:30:00.000Z",
  "deletedAt": null
}
```

### List Products Response
```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "orderId": 1,
      "title": "Sample Product",
      "description": "A sample product description",
      "quantity": 5,
      "totalPrice": 100,
      "totalDiscount": 10,
      "createdAt": "2026-02-09T15:30:00.000Z",
      "updatedAt": "2026-02-09T15:30:00.000Z",
      "deletedAt": null
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Validation Error Response
```json
{
  "message": [
    "totalDiscount cannot exceed totalPrice"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Not Found Error Response
```json
{
  "message": "Product with ID a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Available Sort Fields
- `id`
- `title`
- `quantity`
- `totalPrice`
- `totalDiscount`
- `createdAt`
- `updatedAt`

## Sort Orders
- `asc` - Ascending
- `desc` - Descending (default)

