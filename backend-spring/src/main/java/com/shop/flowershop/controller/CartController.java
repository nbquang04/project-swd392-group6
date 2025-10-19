
package com.shop.flowershop.controller;

import com.shop.flowershop.domain.Cart;
import com.shop.flowershop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;

@RestController
@RequestMapping("/api/carts")
public class CartController {
  private final CartService cartService;
  public CartController(CartService cartService){ this.cartService = cartService; }

  // For demo: read userId from SecurityContext if set; else from header
  private String userId(Principal principal, @RequestHeader(value="X-User-Id", required=false) String fallback){
    return principal != null ? principal.getName() : fallback;
  }

  @GetMapping("/me")
  public Cart myCart(Principal principal, @RequestHeader(value="X-User-Id", required=false) String fallback){
    return cartService.getOrCreateCart(userId(principal, fallback));
  }

  @PostMapping("/me/items")
  public ResponseEntity<Cart> addItem(
      Principal principal,
      @RequestHeader(value="X-User-Id", required=false) String fallback,
      @RequestParam String productId,
      @RequestParam(required=false) String variantId,
      @RequestParam(defaultValue="1") int quantity,
      @RequestParam(defaultValue="0") BigDecimal price
  ){
    return ResponseEntity.ok(cartService.addItem(userId(principal, fallback), productId, variantId, quantity, price));
  }

  @DeleteMapping("/me")
  public ResponseEntity<Cart> clear(Principal principal, @RequestHeader(value="X-User-Id", required=false) String fallback){
    return ResponseEntity.ok(cartService.clear(userId(principal, fallback)));
  }
}
