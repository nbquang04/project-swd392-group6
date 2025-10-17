package com.shop.flowershop.service;

import com.shop.flowershop.domain.Cart;
import com.shop.flowershop.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;
    public CartService(CartRepository cartRepository) { this.cartRepository = cartRepository; }
    public List<Cart> findAll() { return cartRepository.findAll(); }
    public Cart save(Cart c) { return cartRepository.save(c); }
    public void deleteById(String id) { cartRepository.deleteById(id); }
}


