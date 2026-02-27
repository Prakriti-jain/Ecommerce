package org.example.ecom.service;

import jakarta.transaction.Transactional;
import org.example.ecom.exceptions.ResourceNotFoundException;
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

/**
 * This service manages:
 * - Cart creation and retrieval
 * - Adding products to cart
 * - Updating item quantities
 * - Removing items from cart
 */
@Service
public class CartService {
    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private CartItemRepository cartItemRepo;

    /**
     * Retrieves the cart associated with a given user.
     * If the cart does not exist, a new cart is created and saved.
     *
     * @param userId ID of the user
     * @return existing or newly created Cart object
     * @throws ResourceNotFoundException if the user does not exist
     */
    public Cart getCartbyUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not Found!"));

        return cartRepo.findCartByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepo.save(newCart);
        });
    }

    /**
     * Adds a product to the user's cart.
     * Creates a new CartItems entry linking the cart and product.
     *
     * @param userId ID of the user
     * @param productId ID of the product to add
     * @param quantity quantity of the product
     * @return saved CartItems object
     * @throws ResourceNotFoundException if product is not found
     */
    public CartItems addProductToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartbyUser(userId);
        Product product = productRepo.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not Found!"));

        CartItems item = new CartItems();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);

        return cartItemRepo.save(item);
    }

    /**
     * Removes an item from the cart.
     * Removes item from parent cart collection
     * Breaks cart reference in CartItems entity
     *
     * @param itemId ID of the cart item to remove
     * @throws ResourceNotFoundException if the item does not exist
     */
    public void removeFromCart(Long itemId) {

        CartItems item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        Cart cart = item.getCart();
        cart.getCartItems().remove(item);
        cartItemRepo.delete(item);

        cartRepo.save(cart);
    }

    /**
     * Retrieves all items in a user's cart.
     *
     * @param userId ID of the user
     * @return Cart object containing all the cart items
     */
    public Cart getCartItems(Long userId) {
        Cart cart = getCartbyUser(userId);
//        return cartItemRepo.findItemsByCart(cart);
        return cart;
    }

    /**
     * Updates the quantity of a specific cart item.
     *
     * @param itemId ID of the cart item
     * @param quantity new quantity value
     * @return updated CartItems object
     * @throws ResourceNotFoundException if the item does not exist
     */
    public CartItems updateQuantity(Long itemId, int quantity){

        CartItems item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        item.setQuantity(quantity);

        return cartItemRepo.save(item);
    }

}
