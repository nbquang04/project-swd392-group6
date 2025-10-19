
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity @Table(name="product_variants")
@Getter @Setter
public class ProductVariant extends BaseEntity {
  @Id
  private String id;
  @Column(name="product_id", nullable=false)
  private String productId;
  private String color;
  private String size;
  private Integer stock;
  private BigDecimal price; // optional override
}
