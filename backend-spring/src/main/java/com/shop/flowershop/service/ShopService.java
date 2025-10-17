package com.shop.flowershop.service;

import com.shop.flowershop.domain.Shop;
import com.shop.flowershop.repository.ShopRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopService {
    private final ShopRepository shopRepository;
    public ShopService(ShopRepository shopRepository) { this.shopRepository = shopRepository; }
    public List<Shop> findAll() { return shopRepository.findAll(); }
    public Shop save(Shop s) { return shopRepository.save(s); }
    public Shop findById(String id) { return shopRepository.findById(id).orElse(null); }
    public void deleteById(String id) { shopRepository.deleteById(id); }
}


