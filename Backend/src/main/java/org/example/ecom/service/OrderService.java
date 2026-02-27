package org.example.ecom.service;

import jakarta.transaction.Transactional;
import org.example.ecom.exceptions.InventoryException;
import org.example.ecom.exceptions.ResourceNotFoundException;
import org.example.ecom.model.*;
import org.example.ecom.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * This includes:
 * - Placing an order from cart items
 * - Managing stock updates
 * - Fetching user orders
 * - Retrieving detailed order information
 */
@Service
public class OrderService {
    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    /**
     * Places an order for a user for the items present in their cart.
     *
     * Workflow:
     * 1. Fetch user and their cart.
     * 2. Convert cart items into order items.
     * 3. Calculate total order amount.
     * 4. Reduce product stock.
     * 5. Save order and clear cart.
     *
     * @param userId ID of the user placing the order
     * @return saved Order object
     * @throws ResourceNotFoundException if user/cart not found
     * @throws InventoryException if insufficient stock
     */
    @Transactional
    public Order placeOrder(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepo.findCartByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

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
            if (product.getStock() < item.getQuantity()) {
                throw new InventoryException("Not enough stock for product " + product.getName());
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepo.save(product);
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepo.save(order);

        //clear cart
        cartItemRepo.deleteAll(cart.getCartItems());

        cart.getCartItems().clear();
//        cartRepo.save(cart);

        return savedOrder;
    }

    /**
     * Retrieves all orders placed by a specific user.
     *
     * @param userId ID of the user
     * @return list of orders associated with the user
     * @throws ResourceNotFoundException if user is not found
     */
    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        return orderRepo.findOrderByUser(user);
    }

    /**
     * Fetches detailed information of a specific order.
     *
     * @param orderId ID of the order
     * @return Order object with associated order items
     * @throws ResourceNotFoundException if order is not found
     */
    public Order getOrderDetails(Long orderId) {
//        Order order = orderRepo.findById(orderId).get();
//        System.out.println(order.getOrderItemList().size());
        return orderRepo.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
    }
}
