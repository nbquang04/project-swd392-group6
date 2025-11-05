package com.shop.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shop.flowershop.entity.Product;

import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {

  // Trang chi tiết – luôn fetch variants trong cùng query
  @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variants WHERE p.id = :id")
  Product findByIdWithVariants(@Param("id") String id);

  // Trang list/search – dùng EntityGraph để Hibernate load variants riêng SELECT
  @EntityGraph(attributePaths = "variants")
  @Query("""
         SELECT p FROM Product p
         WHERE (:categoryId IS NULL OR p.categoryId = :categoryId)
           AND (:shopId IS NULL OR p.shopId = :shopId)
           AND (:occasion IS NULL OR p.occasion = :occasion)
           AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')))
         """)
  Page<Product> search(@Param("categoryId") String categoryId,
                       @Param("shopId") String shopId,
                       @Param("occasion") String occasion,
                       @Param("q") String q,
                       Pageable pageable);

  @EntityGraph(attributePaths = "variants")
  Page<Product> findByFeaturedTrue(Pageable pageable);
}
