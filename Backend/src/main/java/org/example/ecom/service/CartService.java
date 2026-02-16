package org.example.ecom.service;

import jakarta.transaction.Transactional;
import org.example.ecom.model.Cart;
import org.example.ecom.model.CartItems;
import org.example.ecom.model.Product;
import org.example.ecom.model.User;
import org.example.ecom.repositories.CartItemRepository;
import org.example.ecom.repositories.CartRepository;
import org.example.ecom.repositories.ProductRepository;
import org.example.ecom.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CartService {
    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private CartItemRepository cartItemRepo;

    //get cart of a user or create it
    public Cart getCartbyUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not Found!"));

        return cartRepo.findCartByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepo.save(newCart);
        });
    }

    //Add product to a cart
    public CartItems addProductToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartbyUser(userId);
        Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not Found!"));

        CartItems item = new CartItems();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);

        return cartItemRepo.save(item);
    }

    //remove from cart
    @Transactional
    public void removeFromCart(Long itemId) {

        CartItems item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Cart cart = item.getCart();

        // 🔥 REMOVE FROM PARENT COLLECTION
        cart.getCartItems().remove(item);

        // 🔥 break relation
        item.setCart(null);

        cartRepo.save(cart);
    }



    //get all items in cart
    public Cart getCartItems(Long userId) {
        Cart cart = getCartbyUser(userId);
//        return cartItemRepo.findItemsByCart(cart);
        return cart;
    }

    public CartItems updateQuantity(Long itemId, int quantity){

        CartItems item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setQuantity(quantity);

        return cartItemRepo.save(item);
    }

}
