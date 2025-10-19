
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Table(name="users")
@Getter @Setter
public class User extends BaseEntity {
  @Id
  private String id;
  @Column(nullable=false, unique=true)
  private String email;
  @Column(nullable=false)
  private String password; // BCrypt
  private String fullName;
  @Column(nullable=false)
  private String role;   // USER, ADMIN
  private String status; // Active/Inactive
}
