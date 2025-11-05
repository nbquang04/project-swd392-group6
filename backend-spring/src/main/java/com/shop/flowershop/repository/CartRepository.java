
package com.shop.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.flowershop.entity.Cart;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {
  Optional<Cart> findByUserId(String userId);
  boolean existsByUserId(String userId);
}
