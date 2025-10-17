package com.shop.flowershop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.shop.flowershop.domain.Shop;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/shops", "/shops"})
public class ShopController {
    private final com.shop.flowershop.service.ShopService shopService;
    private final ObjectMapper mapper;
    public ShopController(com.shop.flowershop.service.ShopService shopService, ObjectMapper mapper) {
        this.shopService = shopService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<ArrayNode> list() {
        return ResponseEntity.ok(mapper.valueToTree(shopService.findAll()));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Shop s) {
        if (s.getId() == null || s.getId().isBlank()) s.setId("SHOP-" + System.currentTimeMillis());
        // createdAt handled by @PrePersist
        return ResponseEntity.status(201).body(shopService.save(s));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Shop s) {
        s.setId(id);
        return ResponseEntity.ok(shopService.save(s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        shopService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


