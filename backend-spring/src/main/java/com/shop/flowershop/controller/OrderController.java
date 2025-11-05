package com.shop.flowershop.controller;

import com.shop.flowershop.dto.order.CreateOrderRequest;
import com.shop.flowershop.dto.order.OrderResponse;
import com.shop.flowershop.entity.Order;
import com.shop.flowershop.entity.OrderItem;
import com.shop.flowershop.service.IdGenerator;
import com.shop.flowershop.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 🧩 Lấy danh sách đơn hàng của người dùng hiện tại
    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> myOrders(@RequestHeader("X-User-Id") String userId) {
        List<OrderResponse> list = orderService.listByUser(userId);
        log.info("📦 [GET] /api/orders/me -> Found {} orders for user {}", list.size(), userId);
        return ResponseEntity.ok(list);
    }

    // 🧩 Lấy chi tiết đơn hàng theo ID
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getById(
            @PathVariable String orderId,
            @RequestHeader("X-User-Id") String userId) {
        OrderResponse order = orderService.getByIdAndUser(orderId, userId);
        if (order == null) {
            log.warn("⚠️ [GET] Order {} not found for user {}", orderId, userId);
            return ResponseEntity.notFound().build();
        }
        log.info("📦 [GET] Order detail {} for user {}", orderId, userId);
        return ResponseEntity.ok(order);
    }

    // 🧩 Tạo đơn hàng mới
    @PostMapping("/me")
    public ResponseEntity<OrderResponse> place(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CreateOrderRequest req) {
        // ✅ Tạo đối tượng Order mới
        Order order = new Order();
        order.setId(IdGenerator.timeId("ORD"));
        order.setUserId(userId);
        order.setAddress(req.address());
        order.setPaymentMethod(req.paymentMethod());
        order.setStatus("Pending");

        // ✅ Gán danh sách OrderItem
        var items = req.items().stream().map(i -> {
            OrderItem item = new OrderItem();
            item.setId(IdGenerator.timeId("OITEM"));
            item.setOrder(order);
            item.setProductId(i.productId());
            item.setVariantId(i.variantId());
            item.setQuantity(i.quantity());
            item.setPrice(i.price());
            return item;
        }).toList();
        order.setItems(items);

        // ✅ Tính tổng tiền
        BigDecimal total = items.stream()
                .map(it -> it.getPrice().multiply(BigDecimal.valueOf(it.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotal(total);

        // ✅ Gọi service để lưu vào DB
        OrderResponse response = orderService.placeOrder(order);

        // ✅ Ghi log console
        log.info("✅ [POST] Order created successfully -> ID: {} | User: {} | Total: {}",
                response.id(), userId, total);

        // ✅ Trả kết quả về FE
        return ResponseEntity.ok(response);
    }

    // 🧩 Hủy đơn hàng (nếu vẫn Pending)
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancel(
            @PathVariable String orderId,
            @RequestHeader("X-User-Id") String userId) {
        boolean cancelled = orderService.cancelOrder(orderId, userId);
        if (!cancelled) {
            log.warn("❌ [DELETE] Failed to cancel order {} for user {}", orderId, userId);
            return ResponseEntity.badRequest().body("Cannot cancel order (maybe already shipped)");
        }
        log.info("🗑️ [DELETE] Order {} cancelled by user {}", orderId, userId);
        return ResponseEntity.ok().body("Order cancelled successfully");
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");

        // 🧠 Kiểm tra input
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body("Missing 'status' field");
        }

        // 🔄 Gọi service để cập nhật trạng thái
        OrderResponse updatedOrder = orderService.updateStatus(orderId, newStatus);

        if (updatedOrder == null) {
            log.warn("⚠️ [PATCH] Cannot update status for order {} -> not found", orderId);
            return ResponseEntity.notFound().build();
        }

        log.info("🔄 [PATCH] Order {} updated to status '{}'", orderId, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    // 🧾 Lấy tất cả đơn hàng (Admin)
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> list = orderService.getAll();
        log.info("📦 [GET] /api/orders -> Found {} orders (admin)", list.size());
        return ResponseEntity.ok(list);
    }

}
