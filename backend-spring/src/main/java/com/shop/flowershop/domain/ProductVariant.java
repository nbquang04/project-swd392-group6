package com.shop.flowershop.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant extends BaseEntity {

    @Id
    private String id;

    private String name;

    private String color;

    private String size;

    @Column( name="stock_quantity",nullable = false)
    private Integer stock;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    // Mối quan hệ nhiều-1: nhiều biến thể thuộc 1 sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;
}
