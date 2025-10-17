package com.shop.flowershop.service;

import com.shop.flowershop.domain.Order;
import com.shop.flowershop.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    public OrderService(OrderRepository orderRepository) { this.orderRepository = orderRepository; }
    public List<Order> findAll() { return orderRepository.findAll(); }
    public Order save(Order o) { return orderRepository.save(o); }
    public void deleteById(String id) { orderRepository.deleteById(id); }
}


