
package com.shop.flowershop.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem extends BaseEntity {
  @Id
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id")
  @com.fasterxml.jackson.annotation.JsonBackReference
  private Order order;

  @Column(name = "product_id", nullable = false)
  private String productId;
  private String variantId;
  private Integer quantity;
  @Column(precision = 15, scale = 2, nullable = false)
  private BigDecimal price = BigDecimal.ZERO;
}
