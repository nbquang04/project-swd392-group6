# ShoeShop Backend

Backend API đơn giản cho ứng dụng ShoeShop, xử lý dữ liệu reviews và thống kê sản phẩm.

## Cài đặt

```bash
cd backend
npm install
```

## Chạy Backend

### Development mode (với nodemon - tự động restart khi có thay đổi)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

Backend sẽ chạy tại `http://localhost:5000`

## API Endpoints

### Reviews
- `GET /api/reviews` - Lấy tất cả reviews
- `GET /api/reviews/:productId` - Lấy reviews theo product ID
- `POST /api/reviews` - Thêm review mới
- `PUT /api/reviews/:reviewId` - Cập nhật review
- `DELETE /api/reviews/:reviewId` - Xóa review

### Product Stats
- `GET /api/products/:productId/stats` - Lấy thống kê sản phẩm (rating, review count, sold count)

### Health Check
- `GET /api/health` - Kiểm tra trạng thái backend

## Cấu trúc dữ liệu

Backend đọc dữ liệu từ file `../database.json` (file gốc của project).

## Tính năng

- ✅ CORS enabled cho frontend
- ✅ Error handling
- ✅ Validation dữ liệu
- ✅ Tự động tạo ID và timestamp cho reviews
- ✅ Tính toán thống kê sản phẩm real-time
- ✅ Lưu trữ dữ liệu vào database.json

## Ví dụ sử dụng

### Thêm review mới
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "nike_air_max",
    "user_name": "Nguyễn Văn A",
    "rating": 5,
    "title": "Giày rất tốt",
    "comment": "Chất lượng tuyệt vời"
  }'
```

### Lấy thống kê sản phẩm
```bash
curl http://localhost:5000/api/products/nike_air_max/stats
```
