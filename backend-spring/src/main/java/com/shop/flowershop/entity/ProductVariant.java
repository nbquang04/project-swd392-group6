package com.shop.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant extends BaseEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String sku;

    private String name;

    private String color;

    private String size;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stock;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    // Nhiều biến thể thuộc 1 sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    @PrePersist
    public void prePersist() {
        if (this.id == null || this.id.isBlank()) {
            this.id = "VAR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.sku == null || this.sku.isBlank()) {
            this.sku = "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
