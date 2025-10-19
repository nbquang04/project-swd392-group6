
package com.shop.flowershop.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(@Email String email,
                              @NotBlank String password,
                              @NotBlank String fullName) {}
