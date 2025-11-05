
package com.shop.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shop.flowershop.entity.Shop;

public interface ShopRepository extends JpaRepository<Shop, String> { }
