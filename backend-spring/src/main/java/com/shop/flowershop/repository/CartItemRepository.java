package com.shop.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.flowershop.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
}
