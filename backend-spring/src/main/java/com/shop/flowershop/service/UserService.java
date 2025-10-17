package com.shop.flowershop.service;

import com.shop.flowershop.domain.User;
import com.shop.flowershop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }
    public List<User> findAll() { return userRepository.findAll(); }
    public User save(User u) { return userRepository.save(u); }
    public void deleteById(String id) { userRepository.deleteById(id); }
}


