
package com.shop.flowershop.repository;

import com.shop.flowershop.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> { }
