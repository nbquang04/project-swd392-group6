package com.shop.flowershop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * CartItem entity - từng sản phẩm nằm trong Cart của người dùng.
 */
@Entity
@Table(name = "cart_items")
@Getter
@Setter
public class CartItem extends BaseEntity {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference
    private Cart cart;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "variant_id")
    private String variantId;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal price = BigDecimal.ZERO;

    // ✅ Đồng bộ 2 chiều khi gán Cart
    public void assignCart(Cart c) {
        this.cart = c;
        if (!c.getItems().contains(this)) {
            c.getItems().add(this);
        }
    }
}
