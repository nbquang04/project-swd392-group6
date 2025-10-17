package com.shop.flowershop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/cart", "/cart"})
public class CartController {
    private final com.shop.flowershop.service.CartService cartService;
    private final ObjectMapper mapper;
    public CartController(com.shop.flowershop.service.CartService cartService, ObjectMapper mapper) {
        this.cartService = cartService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<ArrayNode> list() {
        return ResponseEntity.ok(mapper.valueToTree(cartService.findAll()));
    }

    @PostMapping
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> create(@RequestBody com.shop.flowershop.domain.Cart payload) {
        if (payload.getId() == null || payload.getId().isBlank()) payload.setId("CART-" + System.currentTimeMillis());
        var saved = cartService.save(payload);
        return ResponseEntity.status(201).body(mapper.valueToTree(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> update(@PathVariable String id, @RequestBody com.shop.flowershop.domain.Cart payload) {
        payload.setId(id);
        var saved = cartService.save(payload);
        return ResponseEntity.ok(mapper.valueToTree(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        cartService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


