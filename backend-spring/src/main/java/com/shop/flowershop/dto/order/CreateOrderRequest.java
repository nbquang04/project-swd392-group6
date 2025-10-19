
package com.shop.flowershop.dto.order;

import java.util.List;

public record CreateOrderRequest(String address, String paymentMethod, List<Item> items) {
  public record Item(String productId, String variantId, Integer quantity, Integer price) {}
}
