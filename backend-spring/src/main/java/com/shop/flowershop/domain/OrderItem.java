
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Table(name="order_items")
@Getter @Setter
public class OrderItem extends BaseEntity {
  @Id
  private String id;

  @ManyToOne(fetch=FetchType.LAZY)
  @JoinColumn(name="order_id")
  private Order order;

  @Column(name="product_id", nullable=false)
  private String productId;
  private String variantId;
  private Integer quantity;
  private Integer price;
}
