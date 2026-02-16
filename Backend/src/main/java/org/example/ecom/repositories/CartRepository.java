package org.example.ecom.repositories;

import org.example.ecom.model.Cart;
import org.example.ecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    //to get cart belonging to the logged user
    Optional<Cart> findCartByUser(User user);
}

