
package com.shop.flowershop.service;

import com.shop.flowershop.domain.User;
import com.shop.flowershop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
  private final UserRepository repo;
  private final PasswordEncoder passwordEncoder;
  public UserService(UserRepository repo, PasswordEncoder passwordEncoder){
    this.repo = repo; this.passwordEncoder = passwordEncoder;
  }

  public boolean existsById(String id){ return repo.existsById(id); }

  public Optional<User> findByEmail(String email){ return repo.findByEmail(email); }

  public User register(String email, String rawPassword, String fullName, String role){
    if (repo.existsByEmail(email)) throw new IllegalArgumentException("Email already registered");
    User u = new User();
    u.setId(IdGenerator.timeId("USR"));
    u.setEmail(email);
    u.setPassword(passwordEncoder.encode(rawPassword));
    u.setFullName(fullName);
    u.setRole(role);
    u.setStatus("Active");
    return repo.save(u);
  }
}
