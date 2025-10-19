package com.shop.flowershop.security;

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
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ✅ tạo JWT hợp lệ theo API mới
    public String generateToken(String subject, Map<String, Object> claims) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setSubject(subject)                     // thay subject() -> setSubject()
                .addClaims(claims)                       // thay claims() -> addClaims()
                .setIssuedAt(new Date(now))              // thay issuedAt() -> setIssuedAt()
                .setExpiration(new Date(now + validityMs)) // thay expiration() -> setExpiration()
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ parse JWT với parserBuilder()
    public io.jsonwebtoken.Jws<io.jsonwebtoken.Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)                     // thay verifyWith() -> setSigningKey()
                .build()
                .parseClaimsJws(token);                 // thay parseSignedClaims() -> parseClaimsJws()
    }
}
