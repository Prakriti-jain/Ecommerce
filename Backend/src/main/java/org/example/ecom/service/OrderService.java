package org.example.ecom.service;

import org.example.ecom.model.*;
import org.example.ecom.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    public Order placeOrder(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findCartByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        double total = 0;
        for(CartItems item: cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());

            total += item.getQuantity() * item.getProduct().getPrice();

            //added order item in orders list
            order.getOrderItemList().add(orderItem);

            //reduce stock
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepo.save(order);

        //clear cart
        cart.getCartItems().clear();
        cartRepo.save(cart);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));

        return orderRepo.findOrderByUser(user);
    }

    public Order getOrderDetails(Long orderId) {
        Order order = orderRepo.findById(orderId).get();
        System.out.println(order.getOrderItemList().size());
        return orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found!"));
    }
}
