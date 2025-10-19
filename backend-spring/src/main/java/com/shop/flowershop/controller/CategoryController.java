
package com.shop.flowershop.controller;

import com.shop.flowershop.domain.Category;
import com.shop.flowershop.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/categories", "/categories"})
public class CategoryController {
    private final CategoryRepository categoryRepository;
    public CategoryController(CategoryRepository categoryRepository){ this.categoryRepository = categoryRepository; }

    @GetMapping
    public List<Category> list(){ return categoryRepository.findAll(); }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category c){
        if (c.getId() == null || c.getId().isBlank()){
            c.setId(com.shop.flowershop.service.IdGenerator.timeId("CAT"));
        }
        return ResponseEntity.ok(categoryRepository.save(c));
    }
}
