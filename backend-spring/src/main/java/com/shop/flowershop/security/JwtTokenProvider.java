package com.shop.flowershop.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret:change-me-now-change-me-now-change-me-now-32bytes}")
    private String secret;

    @Value("${app.jwt.ttl-ms:604800000}") // 7 days
    private long validityMs;

    private SecretKey key;

    @PostConstruct
    void init() {
        // Tạo key đủ 32 bytes (256-bit)
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // 🔹 Tạo JWT token
    public String generateToken(String subject, Map<String, Object> claims) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + validityMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔹 Giải mã và xác thực token
    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }

    // 🔹 Tiện ích lấy claim cụ thể
    public String getSubject(String token) {
        return parse(token).getBody().getSubject();
    }

    public boolean isExpired(String token) {
        Date exp = parse(token).getBody().getExpiration();
        return exp.before(new Date());
    }
}
