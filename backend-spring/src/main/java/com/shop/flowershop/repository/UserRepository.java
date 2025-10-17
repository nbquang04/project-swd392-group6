package com.shop.flowershop.repository;

import com.shop.flowershop.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {}


