# Pages Documentation

## Tổng quan
Tài liệu này mô tả các trang chính trong ứng dụng và cách chúng sử dụng service layer.

## Cấu trúc thư mục

```
src/pages/
├── HomePage.jsx              # Trang chủ
├── ProductPage.jsx           # Trang danh sách sản phẩm
├── DetailProduct.jsx         # Trang chi tiết sản phẩm
├── AboutPage.jsx             # Trang giới thiệu
├── PrivacyPolicy.jsx         # Trang chính sách
├── NotFound.jsx              # Trang 404
├── Forbidden.jsx             # Trang 403
├── Layout.jsx                # Layout chung
├── user/                     # Trang người dùng
│   ├── UserProfile.jsx       # Trang profile
│   ├── ShopCartDetail.jsx    # Trang giỏ hàng
│   ├── Payment.jsx           # Trang thanh toán
│   └── QRPayment.jsx         # Trang thanh toán QR
├── Admin/                    # Trang admin
│   ├── AdminDashboard.jsx    # Dashboard admin
│   ├── UserManagement.jsx    # Quản lý người dùng
│   ├── ProductManagement.jsx # Quản lý sản phẩm
│   ├── EditProduct.jsx       # Chỉnh sửa sản phẩm
│   ├── AddNewProduct.jsx     # Thêm sản phẩm mới
│   ├── OrderManagement.jsx   # Quản lý đơn hàng
│   └── Statistic.jsx         # Thống kê
└── Auth/                     # Trang xác thực
    └── Auth.js               # Trang đăng nhập/đăng ký
```

## Các trang chính

### 1. HomePage.jsx
**Chức năng:**
- Hiển thị sản phẩm nổi bật
- Hiển thị danh mục sản phẩm
- Hero section và newsletter

**Service sử dụng:**
```javascript
import { fetchFeaturedProducts, fetchCategories } from '../service/product.js';
```

**Tính năng:**
- Load dữ liệu song song với Promise.all
- Error handling
- Loading states
- Navigation đến trang sản phẩm

### 2. ProductPage.jsx
**Chức năng:**
- Hiển thị danh sách sản phẩm
- Tìm kiếm và lọc sản phẩm
- Phân trang
- Sắp xếp sản phẩm

**Service sử dụng:**
```javascript
import { fetchProduct, fetchCategories, searchProducts } from '../service/product.js';
import { getProductStats } from '../service/reviews.js';
```

**Tính năng:**
- Enhanced search với service function
- Local filtering fallback
- Category và subcategory filtering
- Color và price filtering
- Rating và review stats
- Add to cart functionality

### 3. DetailProduct.jsx
**Chức năng:**
- Hiển thị chi tiết sản phẩm
- Variant selection (size, color)
- Product reviews
- Related products
- Add to cart và buy now

**Service sử dụng:**
```javascript
import { 
  fetchProductDetail, 
  fetchProductsByCategory, 
  fetchCategories, 
  getReviewsByProductId, 
  createProductReview 
} from '../service/product.js';
```

**Tính năng:**
- Product detail với variants
- Review system
- Related products
- Breadcrumb navigation
- Image gallery
- Stock management

### 4. ShopCartDetail.jsx
**Chức năng:**
- Hiển thị giỏ hàng
- Cập nhật số lượng
- Xóa sản phẩm
- Checkout

**Service sử dụng:**
```javascript
import { getMyCart, updateCartItem, removeFromCart } from '../../service/cart.js';
```

**Tính năng:**
- Cart management
- Quantity updates
- Item removal
- Total calculation
- Checkout flow

### 5. Payment.jsx
**Chức năng:**
- Form thanh toán
- Thông tin giao hàng
- Phương thức thanh toán
- Order summary

**Service sử dụng:**
```javascript
// Sử dụng context functions
const { handleCheckout, getTotal, selectedItems, getUserData, isAuthenticated } = useContext(ShoesShopContext);
```

**Tính năng:**
- Form validation
- Payment method selection
- Order summary
- Responsive design
- Security features

### 6. AdminDashboard.jsx
**Chức năng:**
- Dashboard tổng quan
- Thống kê doanh thu
- Biểu đồ analytics
- Hoạt động gần đây

**Service sử dụng:**
```javascript
import { 
  getDashboardStats, 
  getRevenueStats, 
  getBestSellingProducts, 
  getTopCustomers 
} from '../../service/analytics.js';
```

**Tính năng:**
- Real-time data
- Analytics charts
- Recent activities
- Performance metrics
- Auto-refresh

### 7. OrderManagement.jsx
**Chức năng:**
- Quản lý đơn hàng
- Cập nhật trạng thái
- Filter và search
- Analytics

**Service sử dụng:**
```javascript
import { 
  getOrderManagement, 
  updateOrderStatus, 
  getOrderAnalytics 
} from "../../service/orderManagement.js";
```

**Tính năng:**
- Order status management
- Advanced filtering
- Analytics integration
- Export functionality
- Timeline tracking

## Service Integration

### Authentication
Tất cả các trang đều sử dụng authentication context:
```javascript
const { isAuthenticated, getCurrentUser, logout } = useContext(ShoeShopContext);
```

### Error Handling
Mỗi trang đều có error handling:
```javascript
try {
  const data = await serviceFunction();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

### Loading States
Các trang đều có loading states:
```javascript
const [loading, setLoading] = useState(false);

// In component
if (loading) {
  return <LoadingSpinner />;
}
```

### Data Fetching
Sử dụng useEffect để fetch data:
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await serviceFunction();
      setData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [dependencies]);
```

## Best Practices

### 1. Component Structure
- Sử dụng functional components với hooks
- Tách logic thành custom hooks khi cần
- Sử dụng context cho global state

### 2. Service Integration
- Import service functions từ service layer
- Sử dụng async/await cho API calls
- Handle errors appropriately

### 3. State Management
- Sử dụng useState cho local state
- Sử dụng context cho global state
- Sử dụng useMemo và useCallback cho optimization

### 4. Performance
- Lazy loading cho components
- Memoization cho expensive calculations
- Debouncing cho search

### 5. User Experience
- Loading states
- Error messages
- Success notifications
- Responsive design

## Examples

### Fetching Data
```javascript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProduct();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, []);
```

### Handling User Actions
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

### Form Handling
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await updateUser(formData);
    showSuccess('Profile updated!');
  } catch (error) {
    showError('Failed to update profile');
  }
};
```
