package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByProductIdStartingWith(String productIdPrefix);
}


