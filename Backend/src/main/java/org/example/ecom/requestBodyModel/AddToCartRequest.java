package org.example.ecom.requestBodyModel;

public class AddToCartRequest {
    Long userId;
    Long productId;
    int quantity;

    public Long getUserId() {
        return userId;
    }

    public Long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }
}
