# Service Layer Documentation

## Tổng quan
Service layer này cung cấp các function để tương tác với backend API. Tất cả các function đều được thiết kế để xử lý lỗi và trả về dữ liệu phù hợp.

## Cấu trúc thư mục

```
src/service/
├── index.js              # Axios instance và export tất cả functions
├── endpoints.js           # Định nghĩa các API endpoints
├── auth.js               # Authentication functions
├── product.js            # Product management functions
├── cart.js               # Shopping cart functions
├── order.js              # Order management functions
├── categories.js         # Category management functions
├── users.js              # User management functions
├── reviews.js            # Review management functions
├── shops.js              # Shop management functions
├── analytics.js          # Analytics functions
├── notifications.js      # Notification functions
├── payments.js           # Payment functions
└── README.md             # Documentation này
```

## Cách sử dụng

### 1. Import service functions
```javascript
import { fetchProduct, addToCart, createOrder } from '../service';
// hoặc
import { fetchProduct } from '../service/product.js';
```

### 2. Sử dụng trong components
```javascript
import React, { useState, useEffect } from 'react';
import { fetchProduct, addToCart } from '../service';

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProduct();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);
  
  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        productId: product.id,
        variantId: product.variant_sku,
        quantity: 1,
        price: product.price
      });
      // Handle success
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  return (
    // Component JSX
  );
};
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Đăng ký user mới
- `POST /login` - Đăng nhập
- `GET /me` - Lấy thông tin user hiện tại

### Products (`/api/products`)
- `GET /` - Lấy danh sách sản phẩm
- `GET /:id` - Lấy chi tiết sản phẩm
- `POST /` - Tạo sản phẩm mới
- `PUT /:id` - Cập nhật sản phẩm
- `DELETE /:id` - Xóa sản phẩm

### Cart (`/api/carts`)
- `GET /me` - Lấy giỏ hàng của user
- `POST /me/items` - Thêm sản phẩm vào giỏ hàng
- `DELETE /me` - Xóa tất cả sản phẩm trong giỏ hàng

### Orders (`/api/orders`)
- `GET /me` - Lấy đơn hàng của user
- `POST /me` - Tạo đơn hàng mới

### Categories (`/api/categories`)
- `GET /` - Lấy danh sách danh mục
- `POST /` - Tạo danh mục mới

### Reviews (`/api/products/:productId/reviews`)
- `GET /` - Lấy đánh giá của sản phẩm
- `POST /` - Tạo đánh giá mới

### Shops (`/api/shops`)
- `GET /` - Lấy danh sách cửa hàng
- `POST /` - Tạo cửa hàng mới

## Error Handling

Tất cả service functions đều có error handling:
- Sử dụng try-catch để bắt lỗi
- Log lỗi ra console
- Trả về dữ liệu mặc định khi có lỗi
- Throw error để component có thể xử lý

## Authentication

Service layer tự động thêm JWT token vào headers:
- Token được lấy từ localStorage
- Tự động thêm vào Authorization header
- Xử lý 401 Unauthorized responses

## Response Interceptors

- **Request Interceptor**: Tự động thêm token và user ID vào headers
- **Response Interceptor**: Xử lý 401 errors, tự động logout và redirect

## Best Practices

1. **Luôn sử dụng try-catch** khi gọi service functions
2. **Handle loading states** trong components
3. **Show error messages** cho user khi cần
4. **Validate data** trước khi gửi lên server
5. **Use proper TypeScript types** nếu có

## Examples

### Fetching Products
```javascript
const loadProducts = async () => {
  try {
    setLoading(true);
    const products = await fetchProduct();
    setProducts(products);
  } catch (error) {
    setError('Failed to load products');
  } finally {
    setLoading(false);
  }
};
```

### Adding to Cart
```javascript
const handleAddToCart = async (product) => {
  try {
    await addToCart({
      productId: product.id,
      variantId: product.variant_sku,
      quantity: 1,
      price: product.price
    });
    showSuccess('Added to cart!');
  } catch (error) {
    showError('Failed to add to cart');
  }
};
```

### Creating Order
```javascript
const handleCreateOrder = async (orderData) => {
  try {
    const order = await createOrder(orderData);
    showSuccess('Order created successfully!');
    navigate('/orders');
  } catch (error) {
    showError('Failed to create order');
  }
};
```
