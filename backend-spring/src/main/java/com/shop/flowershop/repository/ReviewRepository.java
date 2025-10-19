
package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
  List<Review> findByProductIdOrderByCreatedAtDesc(String productId);

  @Query("SELECT COALESCE(AVG(r.rating),0) FROM Review r WHERE r.productId = :productId")
  Double averageRating(@Param("productId") String productId);

  long countByProductId(String productId);
}
