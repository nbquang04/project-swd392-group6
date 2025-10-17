package com.shop.flowershop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shop.flowershop.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/reviews", "/reviews"})
public class ReviewController {

    private final ReviewService reviewService;
    private final ObjectMapper mapper;

    public ReviewController(ReviewService reviewService, ObjectMapper mapper) {
        this.reviewService = reviewService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<ArrayNode> list() {
        return ResponseEntity.ok(mapper.valueToTree(reviewService.findAll()));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ArrayNode> byProduct(@PathVariable String productId) {
        return ResponseEntity.ok(mapper.valueToTree(reviewService.findByProductPrefix(productId)));
    }

    @PostMapping
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> create(@RequestBody ObjectNode payload) {
        if (!payload.hasNonNull("product_id") || !payload.hasNonNull("rating")) {
            return ResponseEntity.badRequest()
                    .body(mapper.createObjectNode().put("error", "Thiếu thông tin bắt buộc"));
        }

        String productIdRaw = payload.path("product_id").asText();
        String cleanProductId = productIdRaw.contains("-") ? productIdRaw.split("-")[0] : productIdRaw;

        ObjectNode newReview = mapper.createObjectNode();
        newReview.put("id", "REV-" + System.currentTimeMillis());
        newReview.put("product_id", cleanProductId);
        newReview.put("rating", payload.path("rating").asInt());
        if (payload.has("comment")) newReview.put("comment", payload.path("comment").asText());

        // timestamps handled in entity via @PrePersist/@PreUpdate

        var saved = reviewService.save(
                mapper.convertValue(newReview, com.shop.flowershop.domain.Review.class)
        );
        return ResponseEntity.status(201).body(mapper.valueToTree(saved));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> update(@PathVariable String reviewId, @RequestBody ObjectNode payload) {
        var exist = reviewService.findById(reviewId);
        if (exist == null) return ResponseEntity.notFound().build();

        if (payload.has("product_id")) {
            String raw = payload.path("product_id").asText();
            payload.put("product_id", raw.contains("-") ? raw.split("-")[0] : raw);
        }

        ObjectNode merged = new ObjectMapper().createObjectNode();
        merged.put("id", exist.getId());
        merged.put("product_id", payload.has("product_id") ? payload.path("product_id").asText() : exist.getProductId());
        merged.put("rating", payload.has("rating") ? payload.path("rating").asInt() : exist.getRating());
        if (payload.has("comment") || exist.getComment() != null) {
            merged.put("comment", payload.has("comment") ? payload.path("comment").asText() : exist.getComment());
        }
        // timestamps handled in entity via @PrePersist/@PreUpdate

        var saved = reviewService.save(
                new ObjectMapper().convertValue(merged, com.shop.flowershop.domain.Review.class)
        );
        return ResponseEntity.ok(new ObjectMapper().valueToTree(saved));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ObjectNode> delete(@PathVariable String reviewId) {
        var exist = reviewService.findById(reviewId);
        if (exist == null) return ResponseEntity.notFound().build();
        reviewService.deleteById(reviewId);
        return ResponseEntity.ok(mapper.createObjectNode().put("success", true));
    }

    @GetMapping("/products/{productId}/stats")
    public ResponseEntity<ObjectNode> stats(@PathVariable String productId) {
        var list = reviewService.findByProductPrefix(productId);
        int count = list.size();
        int totalRating = list.stream().map(r -> r.getRating() == null ? 0 : r.getRating()).reduce(0, Integer::sum);
        double avg = count == 0 ? 0.0 : Math.round(((double) totalRating / count) * 10.0) / 10.0;
        ObjectNode resp = mapper.createObjectNode();
        resp.put("averageRating", avg);
        resp.put("reviewCount", count);
        resp.put("soldCount", 0);
        return ResponseEntity.ok(resp);
    }
}
