# Token-Based Authentication Implementation

## Tổng quan

Dự án đã được chuyển đổi từ localStorage-based authentication sang token-based authentication để tăng cường bảo mật và tính linh hoạt.

## Các thay đổi chính

### 1. Database Schema
- Thêm collection `tokens` trong `database.json` để lưu trữ token
- Cấu trúc token:
  ```json
  {
    "id": "1",
    "user_id": "5",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_example_1",
    "expires_at": "2025-01-27T10:00:00Z",
    "created_at": "2025-01-27T09:45:00Z"
  }
  ```

### 2. Context Updates (ShoeShopContext.js)

#### Token Management Functions:
```javascript
// Lấy token từ localStorage
const getToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Lưu token vào localStorage
const setToken = (token) => localStorage.setItem('accessToken', token);
const setRefreshToken = (refreshToken) => localStorage.setItem('refreshToken', refreshToken);

// Xóa token
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
```

#### Token Generation:
```javascript
// Tạo JWT-like token (demo purposes)
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
  };
  
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa('demo_signature');
  
  return `${header}.${payloadEncoded}.${signature}`;
};
```

#### Authentication State:
```javascript
const [currentUser, setCurrentUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

#### Axios Interceptors:
```javascript
// Tự động thêm token vào header
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      setCurrentUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
    }
    return Promise.reject(error);
  }
);
```

### 3. User ID Management

#### Problem Solved:
- **Issue**: User IDs were being generated automatically by JSON Server (alphanumeric format like "68ff", "1de3")
- **Solution**: Implemented explicit numeric ID generation for consistent token functionality

#### Changes in `handleSubmitSignup`:
```javascript
// Generate a clear numeric ID for the new user
// This ensures token functionality works properly with consistent ID format
let id = users.length + 1;

// Ensure the ID is unique by checking existing numeric IDs
// This handles cases where some users might have non-numeric IDs
const existingIds = users.map(user => parseInt(user.id)).filter(id => !isNaN(id));
if (existingIds.length > 0) {
    id = Math.max(...existingIds) + 1;
}

const newUser = {
    id: id.toString(), // Explicitly set the ID
    name,
    phone,
    email,
    password,
    address,
    role: "customer",
    created_at: new Date().toISOString().split("T")[0],
};
```

#### Database Updates:
- Updated existing users with alphanumeric IDs to numeric format
- All new users will have consistent numeric IDs
- Token system now works reliably with predictable user IDs

### 4. Updated Components

#### Auth.js
- Sử dụng `isAuthenticated` thay vì `localStorage.getItem("user")`
- Login function trả về status object
- Tự động redirect khi đã đăng nhập

#### User Components
- `UserProfile.jsx`: Sử dụng `getCurrentUser()` và `isAuthenticated`
- `UserInfo.jsx`: Sử dụng `logout()` function
- `ShopCartDetail.jsx`: Sử dụng `getCurrentUser()`
- `EditProfile.jsx`: Sử dụng `getCurrentUser()` và `users` array

## Cách sử dụng

### 1. Login
```javascript
const { handleSubmitLogin } = useContext(ShoesShopContext);

const handleLogin = async (e) => {
  const result = await handleSubmitLogin(e);
  if (result.status) {
    // Login successful
    console.log('User logged in successfully');
  } else {
    // Login failed
    console.log('Login failed');
  }
};
```

### 2. Check Authentication Status
```javascript
const { isAuthenticated, currentUser } = useContext(ShoesShopContext);

if (isAuthenticated) {
  console.log('User is logged in:', currentUser);
} else {
  console.log('User is not logged in');
}
```

### 3. Get Current User
```javascript
const { getCurrentUser } = useContext(ShoesShopContext);

const user = getCurrentUser();
if (user) {
  console.log('Current user:', user);
}
```

### 4. Logout
```javascript
const { logout } = useContext(ShoesShopContext);

const handleLogout = () => {
  logout(); // Clears tokens and redirects to /auth
};
```

### 5. Protected Routes
```javascript
const { isAuthenticated } = useContext(ShoesShopContext);

if (!isAuthenticated) {
  return <Navigate to="/auth" />;
}
```

## Testing

### 1. Token Testing
Sử dụng component `TokenTest.jsx` để test token authentication:

```javascript
import TokenTest from './Components/TokenTest';

// Trong component của bạn
<TokenTest />
```

Component này sẽ hiển thị:
- Authentication status
- Current user information
- Token details
- Buttons để test logout và getCurrentUser

### 2. User ID Testing
Sử dụng component `UserIDTest.jsx` để test user ID generation:

```javascript
import UserIDTest from './Components/UserIDTest';

// Trong component của bạn
<UserIDTest />
```

Component này sẽ hiển thị:
- Danh sách tất cả users với ID
- Authentication status
- Test results cho ID consistency
- Verification của numeric ID format

## Lưu ý quan trọng

### 1. Token Expiration
- Access token có thời hạn 15 phút
- Khi token hết hạn, user sẽ tự động được redirect về trang login
- Refresh token được lưu trữ để có thể implement refresh logic sau này

### 2. Backward Compatibility
- Vẫn lưu user object trong localStorage để tương thích với code cũ
- Có thể dần dần loại bỏ trong tương lai

### 3. Security Considerations
- **Current Implementation**: Sử dụng browser-compatible JWT implementation (base64 encoding)
- **JWT Secret**: Sử dụng environment variable `REACT_APP_JWT_SECRET` (optional, có fallback)
- **Token Security**: 
  - Base64 encoding cho demo purposes
  - Simple signature implementation
  - Token expiration checking
  - Browser-compatible (không cần Node.js polyfills)
- **Production Recommendations**:
  - Sử dụng thư viện `jose` cho browser environments
  - HttpOnly cookies
  - HTTPS
  - Proper token refresh mechanism
  - Secure secret key management

### 4. API Calls
- Tất cả API calls sẽ tự động include Authorization header
- Nếu token hết hạn, user sẽ được redirect về login page

## Migration Checklist

- [x] Update database schema
- [x] Implement token management in context
- [x] Update authentication functions
- [x] Add axios interceptors
- [x] Update user components
- [x] Create test component
- [x] Update Auth component
- [ ] Test all functionality
- [ ] Update documentation
- [ ] Remove old localStorage dependencies

## Future Improvements

1. **Enhanced JWT Implementation**: Sử dụng thư viện `jose` cho browser environments
2. **Token Refresh**: Implement automatic token refresh
3. **HttpOnly Cookies**: Chuyển sang cookies cho bảo mật cao hơn
4. **Role-based Access Control**: Implement RBAC với token
5. **Token Blacklisting**: Implement token revocation
