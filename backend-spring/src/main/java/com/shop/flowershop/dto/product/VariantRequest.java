package com.shop.flowershop.dto.product;

import java.math.BigDecimal;

public record VariantRequest(
    String id,
    String name,
    String color,
    String size,
    BigDecimal price,
    Integer stock
) {}
