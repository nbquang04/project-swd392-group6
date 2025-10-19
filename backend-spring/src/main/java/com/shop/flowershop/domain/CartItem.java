
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity @Table(name="cart_items")
@Getter @Setter
public class CartItem extends BaseEntity {
  @Id
  private String id;

  @ManyToOne(fetch=FetchType.LAZY)
  @JoinColumn(name="cart_id")
  private Cart cart;

  @Column(name="product_id", nullable=false)
  private String productId;

  private String variantId;
  private Integer quantity;
  private BigDecimal price;
}
