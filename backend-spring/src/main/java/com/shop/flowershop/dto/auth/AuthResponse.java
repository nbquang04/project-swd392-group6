
package com.shop.flowershop.dto.auth;

import com.shop.flowershop.domain.User;

public record AuthResponse(String token, User user) {}
