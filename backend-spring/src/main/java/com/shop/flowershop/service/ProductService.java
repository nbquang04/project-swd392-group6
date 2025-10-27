package com.shop.flowershop.service;

import com.shop.flowershop.domain.Product;
import com.shop.flowershop.domain.ProductVariant;
import com.shop.flowershop.dto.product.VariantRequest;
import com.shop.flowershop.repository.ProductRepository;
import com.shop.flowershop.repository.ProductVariantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    public ProductService(ProductRepository productRepository, ProductVariantRepository variantRepository) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    // ✅ Danh sách sản phẩm (có hỗ trợ lọc)
    @Transactional(readOnly = true)
    public Page<Product> list(String categoryId, String shopId, String occasion, String q, Pageable pageable) {
        return productRepository.search(categoryId, shopId, occasion, q, pageable);
    }

    // ✅ Sản phẩm nổi bật
    @Transactional(readOnly = true)
    public Page<Product> featured(Pageable pageable) {
        return productRepository.findByFeaturedTrue(pageable);
    }

    // ✅ Tìm product (mặc định không fetch variants)
    @Transactional(readOnly = true)
    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    // ✅ Tìm product kèm variants (fetch join)
    @Transactional(readOnly = true)
    public Product findByIdWithVariants(String id) {
        return productRepository.findByIdWithVariants(id);
    }

    // ✅ Lưu product (không kèm variants)
    @Transactional
    public Product save(Product p) {
        return productRepository.save(p);
    }

    // ✅ Xóa product
    @Transactional
    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    // ✅ Lưu product kèm danh sách variant (update hoặc create)
    @Transactional
    public Product saveWithVariants(Product p, List<VariantRequest> variantRequests) {
        if (variantRequests != null && !variantRequests.isEmpty()) {
            // Xóa tất cả variants cũ
            variantRepository.deleteByProductId(p.getId());
            p.getVariants().clear();

            // Tạo mới danh sách variants
            for (VariantRequest vr : variantRequests) {
                ProductVariant v = new ProductVariant();
                v.setId(IdGenerator.timeId("VAR"));
                v.setName(vr.name());
                v.setColor(vr.color());
                v.setSize(vr.size());
                v.setPrice(vr.price());
                v.setStock(vr.stock());
                v.setProduct(p);
                p.getVariants().add(v);
            }
        }
        return productRepository.save(p);
    }
}
