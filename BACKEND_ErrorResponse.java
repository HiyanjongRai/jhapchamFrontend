package com.example.jhapcham.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Standard error response format for all API errors
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    /**
     * HTTP status code (400, 401, 403, 404, 500, etc.)
     */
    private int status;
    
    /**
     * General error message
     */
    private String message;
    
    /**
     * Field-specific validation errors (for 400 Bad Request)
     * Example: {"email": "Email is required", "password": "Password too short"}
     */
    private Map<String, String> errors;
    
    /**
     * Additional error details
     */
    private String details;
    
    /**
     * Timestamp when the error occurred
     */
    private String timestamp;
    
    /**
     * Request path that caused the error
     */
    private String path;
    
    /**
     * Stack trace (only included in development mode)
     */
    private String trace;
}
