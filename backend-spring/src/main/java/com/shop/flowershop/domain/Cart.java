
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name="carts")
@Getter @Setter
public class Cart extends BaseEntity {
  @Id
  private String id;
  @Column(name="user_id", nullable=false, unique=true)
  private String userId;

  @OneToMany(mappedBy="cart", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<CartItem> items = new ArrayList<>();
}
