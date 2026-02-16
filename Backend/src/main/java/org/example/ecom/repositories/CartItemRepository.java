package org.example.ecom.repositories;

import org.example.ecom.model.Cart;
import org.example.ecom.model.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItems, Long> {

    //to get the list of items in the cart
    List<CartItems> findItemsByCart(Cart cart);
}
