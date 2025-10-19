
package com.shop.flowershop.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity @Table(name="shops")
@Getter @Setter
public class Shop extends BaseEntity {
  @Id
  private String id;
  private String name;
  private String email;
  private String phone;
  private String address;
  private String status;
}
