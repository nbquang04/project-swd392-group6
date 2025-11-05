package com.shop.flowershop.controller;

import com.shop.flowershop.entity.Cart;
import com.shop.flowershop.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * ✅ Helper: Lấy userId từ Principal hoặc header (frontend gửi X-User-Id)
     */
    private String extractUserId(Principal principal, String fallback) {
        if (principal != null && principal.getName() != null && !principal.getName().isBlank()) {
            return principal.getName();
        }
        if (fallback != null && !fallback.isBlank()) {
            return fallback;
        }
        throw new IllegalArgumentException("Missing user identifier");
    }

    /**
     * ✅ Lấy giỏ hàng của user hiện tại
     */
    @GetMapping("/me")
    public ResponseEntity<Cart> getMyCart(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) String fallback
    ) {
        try {
            String userId = extractUserId(principal, fallback);
            Cart cart = cartService.getOrCreateCart(userId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * ✅ Thêm sản phẩm vào giỏ hàng
     */
    @PostMapping("/me/items")
    public ResponseEntity<Cart> addItemToCart(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) String fallback,
            @RequestParam String productId,
            @RequestParam(required = false) String variantId,
            @RequestParam(defaultValue = "1") int quantity,
            @RequestParam(defaultValue = "0") BigDecimal price
    ) {
        try {
            String userId = extractUserId(principal, fallback);
            Cart updated = cartService.addItem(userId, productId, variantId, quantity, price);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ Cập nhật số lượng 1 sản phẩm trong giỏ hàng
     */
    @PutMapping("/me/items/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) String fallback,
            @PathVariable String itemId,
            @RequestParam int quantity
    ) {
        try {
            String userId = extractUserId(principal, fallback);
            Cart updated = cartService.updateItemQuantity(userId, itemId, quantity);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ Xóa 1 sản phẩm khỏi giỏ hàng
     */
    @DeleteMapping("/me/items/{itemId}")
    public ResponseEntity<Cart> removeItem(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) String fallback,
            @PathVariable String itemId
    ) {
        try {
            String userId = extractUserId(principal, fallback);
            Cart updated = cartService.removeItem(userId, itemId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ Xóa toàn bộ giỏ hàng
     */
    @DeleteMapping("/me")
    public ResponseEntity<Cart> clearCart(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) String fallback
    ) {
        try {
            String userId = extractUserId(principal, fallback);
            Cart cleared = cartService.clear(userId);
            return ResponseEntity.ok(cleared);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ✅ Tính tổng tiền giỏ hàng
     */
    @GetMapping("/me/total")
    public ResponseEntity<BigDecimal> getCartTotal(
            Principal principal,
            @RequestHeader(value = "X-User-Id", required = false) String fallback
    ) {
        try {
            String userId = extractUserId(principal, fallback);
            BigDecimal total = cartService.calculateTotal(userId);
            return ResponseEntity.ok(total);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
