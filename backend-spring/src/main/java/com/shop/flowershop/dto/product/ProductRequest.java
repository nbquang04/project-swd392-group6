
package com.shop.flowershop.dto.product;

import java.math.BigDecimal;

public record ProductRequest(String id, String name, String description, BigDecimal price,
                             String categoryId, String shopId, String occasion, String size, Boolean featured) {}
