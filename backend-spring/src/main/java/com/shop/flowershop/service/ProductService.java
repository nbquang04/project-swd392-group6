package com.shop.flowershop.service;

import com.shop.flowershop.domain.Product;
import com.shop.flowershop.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll(String categoryId, String q, Integer limit, String occasion, String size) {
        List<Product> base = categoryId != null ? productRepository.findByCategoryId(categoryId) : productRepository.findAll();
        if (occasion != null && !occasion.isEmpty()) {
            String occ = occasion.toLowerCase(Locale.ROOT);
            base = base.stream().filter(p -> p.getOccasion() != null && p.getOccasion().toLowerCase(Locale.ROOT).contains(occ)).toList();
        }
        if (size != null && !size.isEmpty()) {
            String sz = size.toLowerCase(Locale.ROOT);
            base = base.stream().filter(p -> p.getVariants() != null && p.getVariants().stream()
                    .anyMatch(v -> v.getSize() != null && v.getSize().toLowerCase(Locale.ROOT).equals(sz))).toList();
        }
        if (q != null && !q.isEmpty()) {
            String needle = q.toLowerCase(Locale.ROOT);
            base = base.stream().filter(p -> ((p.getName() == null ? "" : p.getName()) + " " + (p.getDescription() == null ? "" : p.getDescription()))
                    .toLowerCase(Locale.ROOT).contains(needle)).toList();
        }
        if (limit != null && limit > 0 && base.size() > limit) {
            return base.subList(0, limit);
        }
        return base;
    }

    public List<Product> findByShop(String shopId, String q, Integer limit, String occasion, String size) {
        List<Product> base = productRepository.findByShopId(shopId);
        if (occasion != null && !occasion.isEmpty()) {
            String occ = occasion.toLowerCase(Locale.ROOT);
            base = base.stream().filter(p -> p.getOccasion() != null && p.getOccasion().toLowerCase(Locale.ROOT).contains(occ)).toList();
        }
        if (size != null && !size.isEmpty()) {
            String sz = size.toLowerCase(Locale.ROOT);
            base = base.stream().filter(p -> p.getVariants() != null && p.getVariants().stream()
                    .anyMatch(v -> v.getSize() != null && v.getSize().toLowerCase(Locale.ROOT).equals(sz))).toList();
        }
        if (q != null && !q.isEmpty()) {
            String needle = q.toLowerCase(Locale.ROOT);
            base = base.stream().filter(p -> ((p.getName() == null ? "" : p.getName()) + " " + (p.getDescription() == null ? "" : p.getDescription()))
                    .toLowerCase(Locale.ROOT).contains(needle)).toList();
        }
        if (limit != null && limit > 0 && base.size() > limit) {
            return base.subList(0, limit);
        }
        return base;
    }

    public Product findById(String id) { return productRepository.findById(id).orElse(null); }

    public Product save(Product p) { return productRepository.save(p); }
    public void deleteById(String id) { productRepository.deleteById(id); }
}


