
package com.shop.flowershop.service;

import com.shop.flowershop.domain.Product;
import com.shop.flowershop.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo){ this.repo = repo; }

    public Page<Product> list(String categoryId, String shopId, String occasion, String q, Pageable pageable) {
        return repo.search(categoryId, shopId, occasion, q, pageable);
    }

    public Page<Product> featured(Pageable pageable) { return repo.findByFeaturedTrue(pageable); }

    public Product findById(String id) { return repo.findById(id).orElse(null); }

    public Product save(Product p) { return repo.save(p); }

    public void deleteById(String id) { repo.deleteById(id); }
}
