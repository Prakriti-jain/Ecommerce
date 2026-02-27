package org.example.ecom.exceptions;

//for password invalidation
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
}
