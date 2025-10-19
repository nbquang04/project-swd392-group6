
package com.shop.flowershop.controller;

import com.shop.flowershop.domain.Shop;
import com.shop.flowershop.repository.ShopRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/shops", "/shops"})
public class ShopController {
    private final ShopRepository shopRepository;
    public ShopController(ShopRepository shopRepository){ this.shopRepository = shopRepository; }

    @GetMapping
    public List<Shop> list(){ return shopRepository.findAll(); }

    @PostMapping
    public ResponseEntity<Shop> create(@RequestBody Shop s){
        if (s.getId() == null || s.getId().isBlank()){
            s.setId(com.shop.flowershop.service.IdGenerator.timeId("SHOP"));
        }
        return ResponseEntity.ok(shopRepository.save(s));
    }
}
