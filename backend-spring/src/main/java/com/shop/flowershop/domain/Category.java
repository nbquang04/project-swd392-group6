
package com.shop.flowershop.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity @Table(name="categories")
@Getter @Setter
public class Category extends BaseEntity {
  @Id
  private String id;
  private String name;
}
