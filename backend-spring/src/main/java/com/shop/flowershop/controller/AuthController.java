
package com.shop.flowershop.controller;

import com.shop.flowershop.domain.User;
import com.shop.flowershop.dto.auth.AuthResponse;
import com.shop.flowershop.dto.auth.LoginRequest;
import com.shop.flowershop.dto.auth.RegisterRequest;
import com.shop.flowershop.security.JwtTokenProvider;
import com.shop.flowershop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserService users;
  private final JwtTokenProvider jwt;
  private final PasswordEncoder encoder;

  public AuthController(UserService users, JwtTokenProvider jwt, PasswordEncoder encoder){
    this.users = users; this.jwt = jwt; this.encoder = encoder;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest req){
    User u = users.register(req.email(), req.password(), req.fullName(), "USER");
    String token = jwt.generateToken(u.getId(), Map.of("role", u.getRole()));
    return ResponseEntity.ok(new AuthResponse(token, u));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest req){
    var user = users.findByEmail(req.email())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    if (user.getPassword()==null || !encoder.matches(req.password(), user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    String token = jwt.generateToken(user.getId(), Map.of("role", user.getRole()));
    return ResponseEntity.ok(new AuthResponse(token, user));
  }

  @GetMapping("/me")
  public ResponseEntity<User> me(@RequestHeader(name="X-User-Id", required=false) String fallbackUserId){
    // In real world, read from SecurityContext. For demo, allow fallback header.
    if (fallbackUserId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No auth");
    return users.findByEmail(fallbackUserId).map(ResponseEntity::ok).orElse(ResponseEntity.status(404).build());
  }
}
