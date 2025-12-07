# Backend Error Handling - Complete Guide

## Overview

The **AllErrorsPage** component displays detailed backend error information including validation errors, server errors, authentication errors, and more.

## Route

`/error` - Displays all backend error details

## How to Use

### 1. Basic Usage - Navigate with Error Data

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// When you catch an error from backend
try {
  const response = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();

    // Navigate to error page with error details
    navigate("/error", {
      state: {
        error: {
          status: response.status,
          message: errorData.message,
          errors: errorData.errors, // Validation errors
          details: errorData.details,
          timestamp: errorData.timestamp,
          path: errorData.path,
          trace: errorData.trace, // Stack trace (dev only)
        },
      },
    });
  }
} catch (error) {
  console.error("Error:", error);
}
```

### 2. With Axios

```javascript
import axios from "axios";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

try {
  const response = await axios.post(`${API_BASE}/api/users/register`, userData);
} catch (error) {
  if (error.response) {
    // Server responded with error
    navigate("/error", {
      state: {
        error: {
          status: error.response.status,
          message: error.response.data.message,
          errors: error.response.data.errors,
          details: error.response.data.details,
          timestamp: error.response.data.timestamp,
          path: error.response.data.path,
        },
      },
    });
  } else if (error.request) {
    // No response from server
    navigate("/backend-down");
  } else {
    // Other errors
    navigate("/network-error");
  }
}
```

### 3. Global Error Handler Utility

Create a utility file `src/utils/errorHandler.js`:

```javascript
export const handleApiError = (error, navigate) => {
  if (!error.response) {
    // Network error or backend down
    navigate("/backend-down");
    return;
  }

  const { status, data } = error.response;

  // Navigate to error page with full error details
  navigate("/error", {
    state: {
      error: {
        status: status,
        message: data.message || "An error occurred",
        errors: data.errors || {},
        details: data.details,
        timestamp: data.timestamp || new Date().toISOString(),
        path: data.path || error.config?.url,
        trace: data.trace,
      },
    },
  });
};

// Usage
import { handleApiError } from "./utils/errorHandler";

try {
  await api.call();
} catch (error) {
  handleApiError(error, navigate);
}
```

## Backend Error Response Format

Your Spring Boot backend should return errors in this format:

### Example 1: Validation Error (400)

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters",
    "username": "Username is already taken"
  },
  "timestamp": "2025-12-05T14:15:30",
  "path": "/api/users/register"
}
```

### Example 2: Authentication Error (401)

```json
{
  "status": 401,
  "message": "Invalid credentials",
  "details": "The email or password you entered is incorrect",
  "timestamp": "2025-12-05T14:15:30",
  "path": "/api/auth/login"
}
```

### Example 3: Authorization Error (403)

```json
{
  "status": 403,
  "message": "Access Denied",
  "details": "You do not have permission to access this resource",
  "timestamp": "2025-12-05T14:15:30",
  "path": "/api/admin/users"
}
```

### Example 4: Not Found (404)

```json
{
  "status": 404,
  "message": "Resource not found",
  "details": "Product with ID 12345 does not exist",
  "timestamp": "2025-12-05T14:15:30",
  "path": "/api/products/12345"
}
```

### Example 5: Server Error (500)

```json
{
  "status": 500,
  "message": "Internal Server Error",
  "details": "An unexpected error occurred while processing your request",
  "timestamp": "2025-12-05T14:15:30",
  "path": "/api/orders/create",
  "trace": "java.lang.NullPointerException: ...\n  at com.example..." // Only in dev
}
```

## Error Types Displayed

The AllErrorsPage shows:

1. **Error Status Code** (400, 401, 403, 404, 500, etc.)
2. **Error Icon** (changes based on error type)
3. **Error Title** (user-friendly title)
4. **Error Description** (helpful explanation)
5. **Error Message** (from backend)
6. **Validation Errors** (field-specific errors)
7. **Additional Details** (extra context)
8. **Timestamp** (when error occurred)
9. **Request Path** (API endpoint that failed)
10. **Stack Trace** (development mode only)

## Color Coding

Different error types have different colors:

- 🔴 **Red** - Error Message
- 🟠 **Orange** - Validation Errors
- 🔵 **Blue** - Additional Details
- 🟣 **Purple** - Timestamp
- 🟢 **Green** - Request Path
- ⚫ **Gray** - Stack Trace

## Spring Boot Error Handler Example

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse response = ErrorResponse.builder()
                .status(400)
                .message("Validation failed")
                .errors(errors)
                .timestamp(LocalDateTime.now().toString())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .status(404)
                .message("Resource not found")
                .details(ex.getMessage())
                .timestamp(LocalDateTime.now().toString())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(404).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericError(
            Exception ex,
            HttpServletRequest request) {

        ErrorResponse response = ErrorResponse.builder()
                .status(500)
                .message("Internal Server Error")
                .details("An unexpected error occurred")
                .timestamp(LocalDateTime.now().toString())
                .path(request.getRequestURI())
                .build();

        // Only include stack trace in development
        if (isDevelopment()) {
            response.setTrace(getStackTrace(ex));
        }

        return ResponseEntity.status(500).body(response);
    }
}

@Data
@Builder
class ErrorResponse {
    private int status;
    private String message;
    private Map<String, String> errors;
    private String details;
    private String timestamp;
    private String path;
    private String trace;
}
```

## Complete Error Handling Example

```javascript
// In your component
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../utils/errorHandler';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Navigate to error page with all details
        navigate('/error', {
          state: {
            error: errorData
          }
        });
        return;
      }

      const data = await response.json();
      // Handle success

    } catch (error) {
      // Network error
      navigate('/backend-down');
    }
  };

  return (
    // Your component JSX
  );
};
```

## Testing

Test different error scenarios:

```javascript
// 400 - Validation Error
navigate("/error", {
  state: {
    error: {
      status: 400,
      message: "Validation failed",
      errors: {
        email: "Email is required",
        password: "Password must be at least 8 characters",
      },
      timestamp: new Date().toISOString(),
      path: "/api/users/register",
    },
  },
});

// 401 - Unauthorized
navigate("/error", {
  state: {
    error: {
      status: 401,
      message: "Invalid credentials",
      details: "The email or password is incorrect",
      timestamp: new Date().toISOString(),
      path: "/api/auth/login",
    },
  },
});

// 500 - Server Error
navigate("/error", {
  state: {
    error: {
      status: 500,
      message: "Internal Server Error",
      details: "Database connection failed",
      timestamp: new Date().toISOString(),
      path: "/api/products",
    },
  },
});
```

## Best Practices

1. **Always pass error details** when navigating to `/error`
2. **Use consistent error format** from backend
3. **Don't expose sensitive information** in production
4. **Log errors** for debugging before redirecting
5. **Provide helpful messages** to users
6. **Include timestamp** for tracking
7. **Show stack trace only in development**

## All Error Pages Summary

| Route            | Purpose                         |
| ---------------- | ------------------------------- |
| `/error`         | **All backend errors** (NEW) ⭐ |
| `/404`           | Page not found                  |
| `/403`           | Access denied                   |
| `/500`           | Server error                    |
| `/network-error` | No internet                     |
| `/backend-down`  | API server offline              |

Now you have complete error handling for all backend errors! 🎉
