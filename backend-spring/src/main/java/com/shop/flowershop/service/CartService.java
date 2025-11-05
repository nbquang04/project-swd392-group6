package com.shop.flowershop.service;

import com.shop.flowershop.repository.CartRepository;
import com.shop.flowershop.entity.Cart;
import com.shop.flowershop.entity.CartItem;
import com.shop.flowershop.repository.CartItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;

    public CartService(CartRepository cartRepo, CartItemRepository cartItemRepo) {
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
    }

    /**
     * ✅ Lấy hoặc tạo mới giỏ hàng cho user
     */
    public Cart getOrCreateCart(String userId) {
        return cartRepo.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setId(IdGenerator.timeId("CART"));
            c.setUserId(userId);
            return cartRepo.save(c);
        });
    }

    /**
     * ✅ Thêm sản phẩm vào giỏ hàng (nếu đã có thì tăng số lượng)
     */
    @Transactional
    public Cart addItem(String userId, String productId, String variantId, int quantity, BigDecimal price) {
        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId)
                        && ((i.getVariantId() == null && variantId == null)
                        || (i.getVariantId() != null && i.getVariantId().equals(variantId))))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setId(IdGenerator.timeId("CITEM"));
            item.setProductId(productId);
            item.setVariantId(variantId);
            item.setQuantity(quantity);
            item.setPrice(price);

            // ✅ đảm bảo 2 chiều + thêm vào list an toàn
            item.assignCart(cart);
            if (!cart.getItems().contains(item)) {
                cart.getItems().add(item);
            }
        }

        return cartRepo.save(cart);
    }

    /**
     * ✅ Cập nhật số lượng item trong giỏ
     */
    @Transactional
    public Cart updateItemQuantity(String userId, String itemId, int newQuantity) {
        Cart cart = getOrCreateCart(userId);

        cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .ifPresent(i -> i.setQuantity(newQuantity));

        return cartRepo.save(cart);
    }

    /**
     * ✅ Xóa 1 item khỏi giỏ hàng
     */
    @Transactional
    public Cart removeItem(String userId, String itemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> {
            boolean match = i.getId().equals(itemId);
            if (match) i.setCart(null); // ⚠️ đảm bảo orphanRemoval kích hoạt
            return match;
        });
        return cartRepo.save(cart);
    }

    /**
     * ✅ Xóa toàn bộ giỏ hàng
     */
    @Transactional
    public Cart clear(String userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().forEach(i -> i.setCart(null)); // ⚠️ xóa sạch liên kết
        cart.getItems().clear();
        return cartRepo.save(cart);
    }

    /**
     * ✅ Tính tổng tiền giỏ hàng (quantity * price)
     */
    public BigDecimal calculateTotal(String userId) {
        Cart cart = getOrCreateCart(userId);
        return cart.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
