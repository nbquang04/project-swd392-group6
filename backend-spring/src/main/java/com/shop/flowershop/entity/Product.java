package com.shop.flowershop.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product extends BaseEntity {

    @Id
    private String id;

    private String name;

    @Column(length = 2000)
    private String description;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "category_id")
    private String categoryId;

    @Column(name = "shop_id")
    private String shopId;

    private String occasion;

    private String size;

    private boolean featured;

    // Một sản phẩm có nhiều biến thể
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProductVariant> variants = new ArrayList<>();

    // Hàm tiện ích quản lý quan hệ hai chiều
    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }

    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }
}
