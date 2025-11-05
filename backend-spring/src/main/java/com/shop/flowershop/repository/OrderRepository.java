
package com.shop.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.flowershop.entity.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
  List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
  List<Order> findAllByOrderByCreatedAtDesc();
  List<Order> findByStatusOrderByCreatedAtDesc(String status);
}
