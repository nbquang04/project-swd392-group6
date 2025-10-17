package com.shop.flowershop.service;

import com.shop.flowershop.domain.Category;
import com.shop.flowershop.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public CategoryService(CategoryRepository categoryRepository) { this.categoryRepository = categoryRepository; }
    public List<Category> findAll() { return categoryRepository.findAll(); }
    public Category save(Category c) { return categoryRepository.save(c); }
    public void deleteById(String id) { categoryRepository.deleteById(id); }
}


