
package com.shop.flowershop.repository;

import com.shop.flowershop.domain.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, String> {
  List<ProductVariant> findByProductId(String productId);
}
