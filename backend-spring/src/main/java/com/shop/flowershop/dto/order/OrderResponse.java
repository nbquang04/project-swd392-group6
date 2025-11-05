package com.shop.flowershop.dto.order;

import com.shop.flowershop.dto.order.OrderResponse.OrderItemDto;
import com.shop.flowershop.entity.Order;
import com.shop.flowershop.entity.OrderItem;

import java.math.BigDecimal;
import java.util.List;

public record OrderResponse(
                String id,
                String status,
                BigDecimal total, // ✅ BigDecimal thay cho Integer
                String address,
                String paymentMethod,
                List<OrderItemDto> items) {
        public static record OrderItemDto(
                        String productId,
                        String variantId,
                        Integer quantity,
                        BigDecimal price // ✅ BigDecimal thay cho Integer
        ) {
        }

        public static OrderResponse from(Order o) {
                if (o == null)
                        return null;

                var items = (o.getItems() != null ? o.getItems() : List.<OrderItem>of())
                                .stream()
                                .map(i -> new OrderItemDto(
                                                i.getProductId(),
                                                i.getVariantId(),
                                                i.getQuantity(),
                                                i.getPrice() != null ? i.getPrice() : BigDecimal.ZERO))
                                .toList();

                return new OrderResponse(
                                o.getId(),
                                o.getStatus(),
                                o.getTotal() != null ? o.getTotal() : BigDecimal.ZERO,
                                o.getAddress(),
                                o.getPaymentMethod(),
                                items);
        }

}
