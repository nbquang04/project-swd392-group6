const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Đường dẫn đến database.json
const dbPath = path.join(__dirname, '../database.json');

// API Routes

// GET /api/reviews - Lấy tất cả reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);
        res.json(db.reviews || []);
    } catch (error) {
        console.error('Error reading reviews:', error);
        res.status(500).json({ error: 'Không thể đọc dữ liệu reviews' });
    }
});

// Hàm helper để tìm reviews theo product ID
function findReviewsByProductId(reviews, productId) {
    return reviews.filter(review => {
        // Kiểm tra product_id chính xác
        if (review.product_id === productId) return true;
        
        // Kiểm tra product_id bắt đầu với productId (cho trường hợp có variant)
        if (review.product_id && review.product_id.startsWith(productId + '-')) return true;
        
        return false;
    });
}

// GET /api/reviews/:productId - Lấy reviews theo product ID
app.get('/api/reviews/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);
        
        const reviews = findReviewsByProductId(db.reviews || [], productId);
        res.json(reviews);
    } catch (error) {
        console.error('Error reading reviews by product ID:', error);
        res.status(500).json({ error: 'Không thể đọc dữ liệu reviews' });
    }
});

// GET /api/products/:productId/stats - Lấy thống kê sản phẩm
app.get('/api/products/:productId/stats', async (req, res) => {
    try {
        const { productId } = req.params;
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);
        
        const reviews = findReviewsByProductId(db.reviews || [], productId);
        
        if (reviews.length === 0) {
            return res.json({
                averageRating: 0,
                reviewCount: 0,
                soldCount: 0
            });
        }
        
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const soldCount = reviews.filter(review => review.verified_purchase).length;
        
        res.json({
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: reviews.length,
            soldCount: soldCount
        });
    } catch (error) {
        console.error('Error calculating product stats:', error);
        res.status(500).json({ error: 'Không thể tính toán thống kê sản phẩm' });
    }
});

// POST /api/reviews - Thêm review mới
app.post('/api/reviews', async (req, res) => {
    try {
        const newReview = req.body;
        
        // Validate dữ liệu
        if (!newReview.product_id || !newReview.user_name || !newReview.rating) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }
        
        // Xử lý product_id - nếu có dạng "product-variant", chỉ giữ lại phần product
        let cleanProductId = newReview.product_id;
        if (cleanProductId.includes('-')) {
            const parts = cleanProductId.split('-');
            // Kiểm tra xem có phải là variant SKU không
            if (parts.length >= 2) {
                // Giữ lại phần đầu tiên làm product_id
                cleanProductId = parts[0];
                console.log(`Cleaned product_id from "${newReview.product_id}" to "${cleanProductId}"`);
            }
        }
        
        // Đọc database hiện tại
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);
        
        // Kiểm tra xem product có tồn tại không
        const productExists = (db.products || []).some(product => product.id === cleanProductId);
        if (!productExists) {
            return res.status(400).json({ error: 'Sản phẩm không tồn tại' });
        }
        
        // Tạo ID mới
        newReview.id = `REV-${Date.now()}`;
        newReview.product_id = cleanProductId; // Sử dụng product_id đã được làm sạch
        newReview.created_at = new Date().toISOString();
        newReview.updated_at = new Date().toISOString();
        
        // Thêm review mới
        if (!db.reviews) db.reviews = [];
        db.reviews.push(newReview);
        
        // Lưu vào database
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
        
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Không thể thêm review' });
    }
});

// PUT /api/reviews/:reviewId - Cập nhật review
app.put('/api/reviews/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const updatedData = req.body;
        
        // Đọc database hiện tại
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);
        
        // Tìm và cập nhật review
        const reviewIndex = (db.reviews || []).findIndex(review => review.id === reviewId);
        
        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Không tìm thấy review' });
        }
        
        // Xử lý product_id nếu có cập nhật
        if (updatedData.product_id) {
            let cleanProductId = updatedData.product_id;
            if (cleanProductId.includes('-')) {
                const parts = cleanProductId.split('-');
                if (parts.length >= 2) {
                    cleanProductId = parts[0];
                    console.log(`Cleaned updated product_id from "${updatedData.product_id}" to "${cleanProductId}"`);
                }
            }
            updatedData.product_id = cleanProductId;
        }
        
        db.reviews[reviewIndex] = {
            ...db.reviews[reviewIndex],
            ...updatedData,
            updated_at: new Date().toISOString()
        };
        
        // Lưu vào database
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
        
        res.json(db.reviews[reviewIndex]);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Không thể cập nhật review' });
    }
});

// DELETE /api/reviews/:reviewId - Xóa review
app.delete('/api/reviews/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        // Đọc database hiện tại
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);
        
        // Tìm và xóa review
        const reviewIndex = (db.reviews || []).findIndex(review => review.id === reviewId);
        
        if (reviewIndex === -1) {
            return res.status(404).json({ error: 'Không tìm thấy review' });
        }
        
        db.reviews.splice(reviewIndex, 1);
        
        // Lưu vào database
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
        
        res.json({ success: true, message: 'Đã xóa review thành công' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Không thể xóa review' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend đang hoạt động' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server đang chạy tại http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET  /api/reviews - Lấy tất cả reviews`);
    console.log(`   GET  /api/reviews/:productId - Lấy reviews theo sản phẩm`);
    console.log(`   GET  /api/products/:productId/stats - Lấy thống kê sản phẩm`);
    console.log(`   POST /api/reviews - Thêm review mới`);
    console.log(`   PUT  /api/reviews/:reviewId - Cập nhật review`);
    console.log(`   DELETE /api/reviews/:reviewId - Xóa review`);
});
