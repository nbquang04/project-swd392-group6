
package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
  List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
}
