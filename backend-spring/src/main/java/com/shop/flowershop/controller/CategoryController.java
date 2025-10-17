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

import java.io.IOException;

@RestController
@RequestMapping({"/api/category", "/category"})
public class CategoryController {
    private final com.shop.flowershop.service.CategoryService categoryService;
    private final ObjectMapper mapper;

    public CategoryController(com.shop.flowershop.service.CategoryService categoryService, ObjectMapper mapper) {
        this.categoryService = categoryService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<ArrayNode> list() {
        return ResponseEntity.ok(mapper.valueToTree(categoryService.findAll()));
    }

    @PostMapping
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> create(@RequestBody com.shop.flowershop.domain.Category payload) {
        if (payload.getId() == null || payload.getId().isBlank()) payload.setId("CAT-" + System.currentTimeMillis());
        var saved = categoryService.save(payload);
        return ResponseEntity.status(201).body(mapper.valueToTree(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> update(@PathVariable String id, @RequestBody com.shop.flowershop.domain.Category payload) {
        payload.setId(id);
        var saved = categoryService.save(payload);
        return ResponseEntity.ok(mapper.valueToTree(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


