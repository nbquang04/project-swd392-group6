package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {}


