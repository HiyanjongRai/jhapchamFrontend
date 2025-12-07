package com.example.jhapcham.exception;

/**
 * Exception for forbidden access (403)
 * Use this when user is authenticated but doesn't have permission
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }
}
