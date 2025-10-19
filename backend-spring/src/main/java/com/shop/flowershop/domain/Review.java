
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Table(name="reviews")
@Getter @Setter
public class Review extends BaseEntity {
  @Id
  private String id;
  @Column(name="product_id", nullable=false)
  private String productId;
  private int rating;
  @Column(length=1000)
  private String comment;
  private String author;
}
