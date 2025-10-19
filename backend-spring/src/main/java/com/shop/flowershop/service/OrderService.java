
package com.shop.flowershop.service;

import com.shop.flowershop.domain.Order;
import com.shop.flowershop.domain.OrderItem;
import com.shop.flowershop.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
  private final OrderRepository orderRepo;
  public OrderService(OrderRepository orderRepo){ this.orderRepo = orderRepo; }

  public List<Order> listByUser(String userId){ return orderRepo.findByUserIdOrderByCreatedAtDesc(userId); }

  public Order placeOrder(Order order){
    if (order.getId()==null || order.getId().isBlank()){
      order.setId(IdGenerator.timeId("ORD"));
    }
    for (OrderItem it : order.getItems()) {
      if (it.getId()==null || it.getId().isBlank()) it.setId(IdGenerator.timeId("OITEM"));
      it.setOrder(order);
    }
    if (order.getStatus()==null) order.setStatus("Pending");
    return orderRepo.save(order);
  }
}
