package com.shop.flowershop.domain;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant {
    @Id
    private String sku;
    private Integer price;
    private Integer costPrice;
    private Integer stockQuantity;
    @ElementCollection
    private List<String> images = new ArrayList<>();
    private String colorCode;
    private String size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;
}


