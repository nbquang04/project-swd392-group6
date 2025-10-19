
package com.shop.flowershop.service;

import com.shop.flowershop.domain.Cart;
import com.shop.flowershop.domain.CartItem;
import com.shop.flowershop.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CartService {
  private final CartRepository cartRepo;
  public CartService(CartRepository cartRepo){ this.cartRepo = cartRepo; }

  public Cart getOrCreateCart(String userId){
    return cartRepo.findByUserId(userId).orElseGet(() -> {
      Cart c = new Cart();
      c.setId(IdGenerator.timeId("CART"));
      c.setUserId(userId);
      return cartRepo.save(c);
    });
  }

  public Cart addItem(String userId, String productId, String variantId, int quantity, BigDecimal price){
    Cart cart = getOrCreateCart(userId);
    CartItem item = new CartItem();
    item.setId(IdGenerator.timeId("CITEM"));
    item.setCart(cart);
    item.setProductId(productId);
    item.setVariantId(variantId);
    item.setQuantity(quantity);
    item.setPrice(price);
    cart.getItems().add(item);
    return cartRepo.save(cart);
  }

  public Cart clear(String userId){
    Cart cart = getOrCreateCart(userId);
    cart.getItems().clear();
    return cartRepo.save(cart);
  }
}
