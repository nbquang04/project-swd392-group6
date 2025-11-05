package com.shop.flowershop.service;

import com.shop.flowershop.dto.product.VariantRequest;
import com.shop.flowershop.entity.Product;
import com.shop.flowershop.entity.ProductVariant;
import com.shop.flowershop.repository.ProductRepository;
import com.shop.flowershop.repository.ProductVariantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    public ProductService(ProductRepository productRepository, ProductVariantRepository variantRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    /** ✅ Danh sách sản phẩm (có hỗ trợ lọc) */
    @Transactional(readOnly = true)
    public Page<Product> list(String categoryId, String shopId, String occasion, String q, Pageable pageable) {
        return productRepository.search(categoryId, shopId, occasion, q, pageable);
    }

    /** ✅ Sản phẩm nổi bật */
    @Transactional(readOnly = true)
    public Page<Product> featured(Pageable pageable) {
        return productRepository.findByFeaturedTrue(pageable);
    }

    /** ✅ Tìm sản phẩm (mặc định không fetch variants) */
    @Transactional(readOnly = true)
    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    /** ✅ Tìm sản phẩm kèm variants (fetch join) */
    @Transactional(readOnly = true)
    public Product findByIdWithVariants(String id) {
        return productRepository.findByIdWithVariants(id);
    }

    /** ✅ Lưu product (không kèm variants) */
    @Transactional
    public Product save(Product p) {
        return productRepository.save(p);
    }

    /** ✅ Xoá product */
    @Transactional
    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    /** ✅ Lưu product + variants + images */
    @Transactional
    public Product saveWithVariants(Product p, List<VariantRequest> variantRequests) {
        // 1️⃣ Load product hiện tại từ DB (nếu có)
        Product managed = productRepository.findByIdWithVariants(p.getId());

        if (managed == null) {
            managed = p;
        } else {
            managed.setName(p.getName());
            managed.setDescription(p.getDescription());
            managed.setPrice(p.getPrice());
            managed.setCategoryId(p.getCategoryId());
            managed.setShopId(p.getShopId());
            managed.setOccasion(p.getOccasion());
            managed.setSize(p.getSize());
            managed.setFeatured(p.isFeatured());

            // ✅ Cập nhật danh sách ảnh an toàn
            if (p.getImages() != null) {
                managed.setImages(new ArrayList<>(p.getImages())); // ⚡ bắt buộc tạo list mới
            } else {
                managed.setImages(new ArrayList<>());
            }
        }

        // 2️⃣ Nếu không có variant → xóa hết
        if (variantRequests == null || variantRequests.isEmpty()) {
            managed.getVariants().clear();
            return productRepository.save(managed);
        }

        // 3️⃣ Map variant cũ (chỉ map id hợp lệ)
        Map<String, ProductVariant> existingMap = managed.getVariants().stream()
                .filter(v -> v.getId() != null && !v.getId().isBlank())
                .collect(Collectors.toMap(ProductVariant::getId, v -> v, (v1, v2) -> v1));

        List<ProductVariant> updatedList = new ArrayList<>();

        // 4️⃣ Cập nhật hoặc thêm mới variant
        for (VariantRequest vr : variantRequests) {
            ProductVariant variant;
            if (vr.id() != null && existingMap.containsKey(vr.id())) {
                variant = existingMap.get(vr.id());
            } else {
                variant = new ProductVariant();
                variant.setId(IdGenerator.timeId("VAR"));
                variant.setProduct(managed);
            }

            variant.setName(vr.name());
            variant.setColor(vr.color());
            variant.setSize(vr.size());
            variant.setPrice(vr.price());
            variant.setStock(vr.stock());

            updatedList.add(variant);
        }

        // 5️⃣ Gỡ variant không còn trong request
        List<ProductVariant> toRemove = managed.getVariants().stream()
                .filter(oldV -> updatedList.stream().noneMatch(v -> v.getId().equals(oldV.getId())))
                .collect(Collectors.toList());

        toRemove.forEach(v -> v.setProduct(null));
        managed.getVariants().removeAll(toRemove);

        // 6️⃣ Tránh trùng ID variant
        Set<String> seen = new HashSet<>();
        List<ProductVariant> uniqueList = updatedList.stream()
                .filter(v -> seen.add(v.getId()))
                .collect(Collectors.toList());

        managed.getVariants().clear();
        managed.getVariants().addAll(uniqueList);

        // ✅ 7️⃣ Lưu toàn bộ product
        return productRepository.save(managed);
    }
}
