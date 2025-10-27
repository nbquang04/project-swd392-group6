package com.shop.flowershop.service;

import com.shop.flowershop.domain.Order;
import com.shop.flowershop.domain.OrderItem;
import com.shop.flowershop.dto.order.OrderResponse;
import com.shop.flowershop.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepo;

    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    /**
     * ✅ Lấy danh sách đơn hàng theo user ID (mới nhất trước)
     */
    public List<OrderResponse> listByUser(String userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    /**
     * ✅ Lấy chi tiết đơn hàng theo ID và userId
     */
    public OrderResponse getByIdAndUser(String orderId, String userId) {
        Optional<Order> opt = orderRepo.findById(orderId);
        if (opt.isEmpty()) return null;

        Order order = opt.get();
        if (!order.getUserId().equals(userId)) {
            log.warn("⚠️ [OrderService] Unauthorized access to order {} by user {}", orderId, userId);
            return null;
        }

        // Ép load danh sách items tránh lỗi lazy khi serialize
        if (order.getItems() != null) order.getItems().size();

        return OrderResponse.from(order);
    }

    /**
     * ✅ Tạo đơn hàng mới và trả về DTO sạch cho FE
     */
    @Transactional
    public OrderResponse placeOrder(Order order) {
        // 🧩 Sinh ID nếu chưa có
        if (order.getId() == null || order.getId().isBlank()) {
            order.setId(IdGenerator.timeId("ORD"));
        }

        // 🧩 Gán ID và quan hệ OrderItem
        for (OrderItem it : order.getItems()) {
            if (it.getId() == null || it.getId().isBlank()) {
                it.setId(IdGenerator.timeId("OITEM"));
            }
            it.setOrder(order);
        }

        // 🧩 Gán trạng thái mặc định
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("Pending");
        }

        // 🧩 Lưu đơn hàng (cascading item)
        Order saved = orderRepo.saveAndFlush(order);

        // 🧩 Ép load danh sách item tránh lỗi lazy
        if (saved.getItems() != null) saved.getItems().size();

        // ✅ Ghi log chuẩn, không phá JSON
        log.info("✅ [OrderService] Saved order: {} | Items={} | Total={}",
                saved.getId(),
                saved.getItems() != null ? saved.getItems().size() : 0,
                saved.getTotal());

        // ✅ Trả DTO về Controller
        return OrderResponse.from(saved);
    }

    /**
     * 🗑️ Hủy đơn hàng nếu còn trạng thái Pending
     */
    @Transactional
    public boolean cancelOrder(String orderId, String userId) {
        Optional<Order> opt = orderRepo.findById(orderId);
        if (opt.isEmpty()) return false;

        Order order = opt.get();

        // Kiểm tra quyền hủy
        if (!order.getUserId().equals(userId)) {
            log.warn("❌ [OrderService] User {} tried to cancel order {} not owned by them", userId, orderId);
            return false;
        }

        // Chỉ được hủy nếu vẫn Pending
        if (!"Pending".equalsIgnoreCase(order.getStatus())) {
            log.warn("❌ [OrderService] Cannot cancel order {} with status {}", orderId, order.getStatus());
            return false;
        }

        order.setStatus("Cancelled");
        orderRepo.save(order);
        log.info("🗑️ [OrderService] Order {} cancelled successfully by user {}", orderId, userId);
        return true;
    }
}
