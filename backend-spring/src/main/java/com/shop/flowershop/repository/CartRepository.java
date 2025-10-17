package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, String> {}


