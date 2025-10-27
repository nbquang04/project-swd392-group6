package com.shop.flowershop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.shop.flowershop.domain.Product;
import com.shop.flowershop.dto.product.ProductRequest;
import com.shop.flowershop.service.IdGenerator;
import com.shop.flowershop.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({ "/api/products", "/products" })
public class ProductController {

    private final ProductService productService;
    private final ObjectMapper mapper;

    public ProductController(ProductService productService, ObjectMapper mapper) {
        this.productService = productService;
        this.mapper = mapper;
    }

    // 🔹 Lấy danh sách sản phẩm (có thể filter theo category, shop, occasion, q,...)
    @GetMapping
    public ResponseEntity<ArrayNode> list(
            @RequestParam(value = "categoryId", required = false) String categoryId,
            @RequestParam(value = "category_id", required = false) String category_id,
            @RequestParam(value = "shopId", required = false) String shopId,
            @RequestParam(value = "shop_id", required = false) String shop_id,
            @RequestParam(value = "occasion", required = false) String occasion,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "_limit", required = false) Integer limit,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "20") int size,
            @RequestParam(value = "featured", required = false) Boolean featured) {

        String cid = categoryId != null ? categoryId : category_id;
        String sid = shopId != null ? shopId : shop_id;
        Pageable pageable = PageRequest.of(page, limit != null && limit > 0 ? limit : size);

        Page<Product> result = (featured != null && featured)
                ? productService.featured(pageable)
                : productService.list(cid, sid, occasion, q, pageable);

        ArrayNode arr = mapper.createArrayNode();
        result.getContent().forEach(p -> arr.add(mapper.valueToTree(p)));
        return ResponseEntity.ok(arr);
    }

    // 🔹 Lấy chi tiết sản phẩm (kèm variants)
    @GetMapping("/{id}")
    public ResponseEntity<Product> detail(@PathVariable String id) {
        Product p = productService.findByIdWithVariants(id);
        return p == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(p);
    }

    // 🔹 Tạo sản phẩm (chưa kèm variant)
    @PostMapping
    public ResponseEntity<Product> create(@RequestBody ProductRequest req) {
        Product payload = new Product();
        payload.setId(IdGenerator.timeId("PROD"));
        payload.setName(req.name());
        payload.setDescription(req.description());
        payload.setPrice(req.price());
        payload.setCategoryId(req.categoryId());
        payload.setShopId(req.shopId());
        payload.setOccasion(req.occasion());
        payload.setSize(req.size());
        payload.setFeatured(Boolean.TRUE.equals(req.featured()));

        Product saved = productService.saveWithVariants(payload, req.variants());
        return ResponseEntity.ok(saved);
    }

    // 🔹 Cập nhật sản phẩm (có thể kèm variants)
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody ProductRequest req) {
        Product exist = productService.findByIdWithVariants(id);
        if (exist == null)
            return ResponseEntity.notFound().build();

        exist.setName(req.name());
        exist.setDescription(req.description());
        exist.setPrice(req.price());
        exist.setCategoryId(req.categoryId());
        exist.setShopId(req.shopId());
        exist.setOccasion(req.occasion());
        exist.setSize(req.size());
        if (req.featured() != null)
            exist.setFeatured(req.featured());

        Product updated = productService.saveWithVariants(exist, req.variants());
        return ResponseEntity.ok(updated);
    }

    // 🔹 Xoá sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Lấy danh sách variant của sản phẩm
    @GetMapping("/{id}/variants")
    public ResponseEntity<?> variants(@PathVariable String id) {
        Product p = productService.findByIdWithVariants(id);
        if (p == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p.getVariants());
    }

    // ✅ NEW: Cập nhật tồn kho sản phẩm
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable String id,
            @RequestBody StockUpdateRequest req
    ) {
        Product p = productService.findByIdWithVariants(id);
        if (p == null) return ResponseEntity.notFound().build();

        // Nếu sản phẩm có variants → cập nhật variant tương ứng
        if (p.getVariants() != null && !p.getVariants().isEmpty()) {
            p.getVariants().forEach(v -> {
                if (req.variantId() == null || v.getId().equals(req.variantId())) {
                    v.setStock(req.quantity());
                }
            });
        } else {
            // Nếu sản phẩm không có variant → cập nhật stock trực tiếp
            System.out.println("⚠️ Product has no variants, skip stock update");
        }

        Product saved = productService.save(p);
        System.out.println("✅ [ProductController] Updated stock for product " + id + " → " + req.quantity());
        return ResponseEntity.ok(saved);
    }

    // 📦 DTO phụ để nhận request cập nhật stock
    public record StockUpdateRequest(String variantId, Integer quantity) {}
}
