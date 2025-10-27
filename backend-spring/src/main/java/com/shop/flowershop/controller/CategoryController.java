package com.shop.flowershop.controller;

import com.shop.flowershop.domain.Category;
import com.shop.flowershop.repository.CategoryRepository;
import com.shop.flowershop.service.IdGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/categories", "/categories"})
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ✅ Lấy toàn bộ danh mục
    @GetMapping
    public ResponseEntity<List<Category>> list() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // ✅ Lấy danh mục theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable String id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Tạo mới danh mục
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category c) {
        if (c.getId() == null || c.getId().isBlank()) {
            c.setId(IdGenerator.timeId("CAT"));
        }
        Category saved = categoryRepository.save(c);
        return ResponseEntity.ok(saved);
    }

    // ✅ Cập nhật danh mục
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable String id, @RequestBody Category updated) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    return ResponseEntity.ok(categoryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Xoá danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
