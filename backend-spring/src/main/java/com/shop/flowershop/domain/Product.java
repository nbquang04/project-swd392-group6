
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity @Table(name="products")
@Getter @Setter
public class Product extends BaseEntity {
  @Id
  private String id;
  private String name;
  @Column(length=2000)
  private String description;
  private BigDecimal price;
  @Column(name="category_id")
  private String categoryId;
  @Column(name="shop_id")
  private String shopId;
  private String occasion;
  private String size;
  private boolean featured;
}
