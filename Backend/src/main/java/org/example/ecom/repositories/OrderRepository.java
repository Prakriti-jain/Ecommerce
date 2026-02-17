package org.example.ecom.repositories;

import org.example.ecom.model.Order;
import org.example.ecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findOrderByUser(User user);
}
