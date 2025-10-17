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
@RequestMapping({"/api/users", "/users"})
public class UserController {
    private final com.shop.flowershop.service.UserService userService;
    private final ObjectMapper mapper;
    public UserController(com.shop.flowershop.service.UserService userService, ObjectMapper mapper) {
        this.userService = userService;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<ArrayNode> list() {
        return ResponseEntity.ok(mapper.valueToTree(userService.findAll()));
    }

    @PostMapping
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> create(@RequestBody com.shop.flowershop.domain.User payload) {
        if (payload.getId() == null || payload.getId().isBlank()) payload.setId("USER-" + System.currentTimeMillis());
        var saved = userService.save(payload);
        return ResponseEntity.status(201).body(mapper.valueToTree(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> update(@PathVariable String id, @RequestBody com.shop.flowershop.domain.User payload) {
        payload.setId(id);
        var saved = userService.save(payload);
        return ResponseEntity.ok(mapper.valueToTree(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}


