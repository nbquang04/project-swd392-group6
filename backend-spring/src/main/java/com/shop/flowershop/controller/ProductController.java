package com.shop.flowershop.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.shop.flowershop.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/products", "/products"})
public class ProductController {
    private final ProductService productService;
    private final ObjectMapper mapper;

    public ProductController(ProductService productService, ObjectMapper mapper) {
        this.productService = productService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<ArrayNode> list(
            @RequestParam(value = "category_id", required = false) String categoryId,
            @RequestParam(value = "shop_id", required = false) String shopId,
            @RequestParam(value = "occasion", required = false) String occasion,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "_limit", required = false) Integer limit) {

        var list = (shopId != null && !shopId.isEmpty())
                ? productService.findByShop(shopId, q, limit, occasion, size)
                : productService.findAll(categoryId, q, limit, occasion, size);

        ArrayNode result = mapper.valueToTree(list);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JsonNode> get(@PathVariable String id) {
        var p = productService.findById(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mapper.valueToTree(p));
    }

    @PostMapping
    public ResponseEntity<JsonNode> create(@RequestBody com.shop.flowershop.domain.Product payload) {
        if (payload.getId() == null || payload.getId().isBlank()) {
            payload.setId("PROD-" + System.currentTimeMillis());
        }
        // timestamps are handled by @PrePersist/@PreUpdate in the entity
        var saved = productService.save(payload);
        return ResponseEntity.status(201).body(mapper.valueToTree(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JsonNode> update(@PathVariable String id, @RequestBody com.shop.flowershop.domain.Product payload) {
        var exist = productService.findById(id);
        if (exist == null) return ResponseEntity.notFound().build();
        payload.setId(id);
        // timestamps are handled by @PrePersist/@PreUpdate in the entity
        var saved = productService.save(payload);
        return ResponseEntity.ok(mapper.valueToTree(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
