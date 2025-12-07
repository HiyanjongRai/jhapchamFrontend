package com.example.jhapcham.exception;

/**
 * Exception for unauthorized access (401)
 * Use this when user is not authenticated
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
