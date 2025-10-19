
package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, String> {
  Optional<Cart> findByUserId(String userId);
  boolean existsByUserId(String userId);
}
