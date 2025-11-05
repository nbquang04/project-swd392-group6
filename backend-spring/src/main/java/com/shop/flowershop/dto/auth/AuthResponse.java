
package com.shop.flowershop.dto.auth;

import com.shop.flowershop.entity.User;

public record AuthResponse(String token, User user) {}
