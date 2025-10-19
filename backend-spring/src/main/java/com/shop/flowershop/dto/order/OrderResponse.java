
package com.shop.flowershop.dto.order;

import com.shop.flowershop.domain.Order;
import java.util.List;

public record OrderResponse(String id, String status, Integer total, String address, String paymentMethod,
                            List<OrderItemDto> items) {
  public static record OrderItemDto(String productId, String variantId, Integer quantity, Integer price) {}

  public static OrderResponse from(Order o){
    var items = o.getItems().stream().map(i -> new OrderItemDto(i.getProductId(), i.getVariantId(), i.getQuantity(), i.getPrice())).toList();
    return new OrderResponse(o.getId(), o.getStatus(), o.getTotal(), o.getAddress(), o.getPaymentMethod(), items);
  }
}
