package com.shop.flowershop.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "shops")
@Getter
@Setter
public class Shop {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String status; // Active, Suspended, Pending
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}


