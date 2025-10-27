
package com.shop.flowershop.dto.product;

import java.util.List;
import java.math.BigDecimal;

import java.util.List;
public record ProductRequest(String id, String name, String description, BigDecimal price,
                             String categoryId, String shopId, String occasion, String size, Boolean featured, List<VariantRequest> variants) {}
