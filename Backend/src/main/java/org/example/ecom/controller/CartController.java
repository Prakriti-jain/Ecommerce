package org.example.ecom.controller;

import org.example.ecom.model.Cart;
import org.example.ecom.model.CartItems;
import org.example.ecom.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {
    @Autowired
    private CartService service;

    @PostMapping("/add")
    public CartItems addToCart(@RequestBody Map<String, Object> data) {

        Long userId = Long.valueOf(data.get("userId").toString());
        Long productId = Long.valueOf(data.get("productId").toString());
        int quantity = Integer.parseInt(data.get("quantity").toString());

        return service.addProductToCart(userId, productId, quantity);
    }

    @GetMapping("/{userId}")
    public Cart getCartItems(@PathVariable Long userId) {
        return service.getCartItems(userId);
    }

    @DeleteMapping("/item/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        service.removeFromCart(itemId);
    }

    @PutMapping("/item/{itemId}")
    public CartItems updateQuantity(@PathVariable Long itemId, @RequestBody Map<String,Integer> body) {
        int qty = body.get("quantity");
        return service.updateQuantity(itemId, qty);
    }

}
