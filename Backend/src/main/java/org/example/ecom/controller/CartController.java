package org.example.ecom.controller;

import org.example.ecom.requestBodyModel.AddToCartRequest;
import org.example.ecom.model.Cart;
import org.example.ecom.model.CartItems;
import org.example.ecom.requestBodyModel.UpdateCartRequest;
import org.example.ecom.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
//@CrossOrigin(origins = "http://localhost:4200")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public CartItems addToCart(@RequestBody AddToCartRequest data) {

        Long userId = data.getUserId();
        Long productId = data.getProductId();
        int quantity = data.getQuantity();

        return cartService.addProductToCart(userId, productId, quantity);
    }

    @GetMapping("/{userId}")
    public Cart getCartItems(@PathVariable Long userId) {
        return cartService.getCartItems(userId);
    }

    @DeleteMapping("/item/{itemId}")
    public void removeItem(@PathVariable Long itemId) {
        cartService.removeFromCart(itemId);
    }

    @PutMapping("/item/{itemId}")
    public CartItems updateQuantity(@PathVariable Long itemId, @RequestBody UpdateCartRequest body) {
        int qty = body.getQuantity();
        return cartService.updateQuantity(itemId, qty);
    }

}
