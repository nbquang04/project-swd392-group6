package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, String> {}


