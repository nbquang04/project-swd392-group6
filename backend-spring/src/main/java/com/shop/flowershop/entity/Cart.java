package com.shop.flowershop.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

/**
 * Cart entity – lưu giỏ hàng của từng user.
 * Mỗi user chỉ có 1 cart (user_id unique).
 */
@Entity
@Table(name = "carts")
@Getter
@Setter
public class Cart extends BaseEntity {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    // Một giỏ hàng có nhiều item, ánh xạ ngược qua CartItem.cart
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<CartItem> items = new ArrayList<>();

    // ✅ Helper methods để đảm bảo liên kết hai chiều an toàn
    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }
}
