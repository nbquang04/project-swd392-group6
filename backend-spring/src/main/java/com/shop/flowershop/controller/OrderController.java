
package com.shop.flowershop.controller;

import com.shop.flowershop.domain.Order;
import com.shop.flowershop.domain.OrderItem;
import com.shop.flowershop.dto.order.CreateOrderRequest;
import com.shop.flowershop.dto.order.OrderResponse;
import com.shop.flowershop.service.IdGenerator;
import com.shop.flowershop.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
  private final OrderService orderService;
  public OrderController(OrderService orderService){ this.orderService = orderService; }

  @GetMapping("/me")
  public List<OrderResponse> myOrders(@RequestHeader("X-User-Id") String userId){
    return orderService.listByUser(userId).stream().map(OrderResponse::from).collect(Collectors.toList());
  }

  @PostMapping("/me")
  public ResponseEntity<OrderResponse> place(@RequestHeader("X-User-Id") String userId, @RequestBody CreateOrderRequest req){
    Order o = new Order();
    o.setUserId(userId);
    o.setAddress(req.address());
    o.setPaymentMethod(req.paymentMethod());
    o.setStatus("Pending");
    var items = req.items().stream().map(i -> {
      OrderItem it = new OrderItem();
      it.setId(IdGenerator.timeId("OITEM"));
      it.setProductId(i.productId());
      it.setVariantId(i.variantId());
      it.setQuantity(i.quantity());
      it.setPrice(i.price());
      return it;
    }).toList();
    o.setItems(items);
    int total = items.stream().mapToInt(it -> it.getPrice() * it.getQuantity()).sum();
    o.setTotal(total);
    Order saved = orderService.placeOrder(o);
    return ResponseEntity.ok(OrderResponse.from(saved));
  }
}
