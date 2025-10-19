
package com.shop.flowershop.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name="orders")
@Getter @Setter
public class Order extends BaseEntity {
  @Id
  private String id;
  @Column(name="user_id", nullable=false)
  private String userId;
  private String status; // Pending, Paid, Shipped, Done, Cancelled
  private Integer total; // store as smallest currency unit if needed
  private String address;
  private String paymentMethod;
  private LocalDateTime paidAt;

  @OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval=true)
  private List<OrderItem> items = new ArrayList<>();
}
