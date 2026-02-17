package org.example.ecom.controller;

import org.example.ecom.model.Order;
import org.example.ecom.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/place/{userId}")
    public Order placeOrder(@PathVariable Long userId) {
        return service.placeOrder(userId);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId){
        return service.getOrdersByUser(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrderDetails(@PathVariable Long orderId) {
        return service.getOrderDetails(orderId);
    }
}
