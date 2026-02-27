package org.example.ecom.exceptions;

//for user not found, product not found, item not found, order not found, cart not found
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
