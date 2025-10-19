
package com.shop.flowershop.service;

import com.shop.flowershop.domain.Review;
import com.shop.flowershop.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    public ReviewService(ReviewRepository reviewRepository){ this.reviewRepository = reviewRepository; }

    public List<Review> listByProduct(String productId){
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Review save(Review review){
        if (review.getId()==null || review.getId().isBlank()){
            review.setId(IdGenerator.timeId("REV"));
        }
        return reviewRepository.save(review);
    }

    public Map<String,Object> statsByProduct(String productId){
        double avg = Optional.ofNullable(reviewRepository.averageRating(productId)).orElse(0.0);
        long count = reviewRepository.countByProductId(productId);
        Map<String,Object> m = new HashMap<>();
        m.put("productId", productId);
        m.put("average", avg);
        m.put("count", count);
        return m;
    }
}
