package com.shop.flowershop.service;

import com.shop.flowershop.domain.Review;
import com.shop.flowershop.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) { this.reviewRepository = reviewRepository; }

    public List<Review> findByProductPrefix(String productId) { return reviewRepository.findByProductIdStartingWith(productId); }
    public List<Review> findAll() { return reviewRepository.findAll(); }
    public Review save(Review r) { return reviewRepository.save(r); }
    public Review findById(String id) { return reviewRepository.findById(id).orElse(null); }
    public void deleteById(String id) { reviewRepository.deleteById(id); }
}


