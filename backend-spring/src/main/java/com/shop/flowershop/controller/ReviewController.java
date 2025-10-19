
package com.shop.flowershop.controller;

import com.shop.flowershop.domain.Review;
import com.shop.flowershop.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    public ReviewController(ReviewService reviewService){ this.reviewService = reviewService; }

    @GetMapping
    public List<Review> list(@PathVariable String productId){
        return reviewService.listByProduct(productId);
    }

    @PostMapping
    public ResponseEntity<Review> create(@PathVariable String productId, @RequestBody Review review){
        review.setProductId(productId);
        return ResponseEntity.ok(reviewService.save(review));
    }

    @GetMapping("/stats")
    public Map<String,Object> stats(@PathVariable String productId){
        return reviewService.statsByProduct(productId);
    }
}
