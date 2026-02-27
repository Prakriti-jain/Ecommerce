package org.example.ecom.exceptions;

//for stock related issues
public class InventoryException extends RuntimeException {
    public InventoryException(String message) {
        super(message);
    }
}
