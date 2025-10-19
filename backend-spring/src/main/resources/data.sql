
INSERT INTO categories (id, name, created_at, updated_at) VALUES 
('CAT-1001','Hoa bó', NOW(), NOW()),
('CAT-1002','Hoa chúc mừng', NOW(), NOW()),
('CAT-1003','Hoa cưới', NOW(), NOW());

INSERT INTO shops (id, name, email, phone, address, status, created_at, updated_at) VALUES
('SHOP-1001','LaVie Flowers','contact@lavieflowers.vn','0909000001','12 Hoa Lan, Q.Phú Nhuận, HCM','Active', NOW(), NOW()),
('SHOP-1002','Blossom House','hi@blossomhouse.vn','0909000002','45 Hoa Mai, Q.Phú Nhuận, HCM','Active', NOW(), NOW());

-- Sample products
INSERT INTO products (id, name, description, price, category_id, shop_id, occasion, size, featured, created_at, updated_at) VALUES
('PROD-1001','Bó hoa hồng đỏ','Hoa hồng đỏ sang trọng',350000,'CAT-1001','SHOP-1001','birthday','M', true, NOW(), NOW()),
('PROD-1002','Giỏ hoa chúc mừng','Giỏ hoa tươi sáng',450000,'CAT-1002','SHOP-1002','congrats','L', true, NOW(), NOW());

-- Sample user (password: 123456)
INSERT INTO users (id, email, password, full_name, role, status, created_at, updated_at) VALUES
('USR-1001','user@example.com','$2a$10$JwI8s5q1E5xQlhpE5KxW6u6Ldbq7P2Ff6t7cV0sY8rX9XO0C0x0c6','Demo User','USER','Active', NOW(), NOW());
