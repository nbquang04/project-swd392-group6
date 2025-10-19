
package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, String> {
  @Query("SELECT p FROM Product p " +
         "WHERE (:categoryId IS NULL OR p.categoryId = :categoryId) " +
         "AND (:shopId IS NULL OR p.shopId = :shopId) " +
         "AND (:occasion IS NULL OR p.occasion = :occasion) " +
         "AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')))")
  Page<Product> search(@Param("categoryId") String categoryId,
                       @Param("shopId") String shopId,
                       @Param("occasion") String occasion,
                       @Param("q") String q,
                       Pageable pageable);

  Page<Product> findByFeaturedTrue(Pageable pageable);
}
