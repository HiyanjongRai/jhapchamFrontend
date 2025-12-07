# Backend Error Handling Setup Guide

## Problem

Your backend is throwing exceptions like `IllegalStateException: Only customers can use the cart` but they're only being logged to the console, not returned as JSON responses. This means the frontend error page can't display them.

## Solution

Add a **Global Exception Handler** to your Spring Boot backend that catches ALL exceptions and returns them as properly formatted JSON responses.

## Files to Add to Your Backend

### 1. Create Exception Package

Create a new package: `com.example.jhapcham.exception`

### 2. Add These Files

#### File 1: `ErrorResponse.java`

Location: `src/main/java/com/example/jhapcham/exception/ErrorResponse.java`

```java
package com.example.jhapcham.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private Map<String, String> errors;
    private String details;
    private String timestamp;
    private String path;
    private String trace;
}
```

#### File 2: `GlobalExceptionHandler.java`

Location: `src/main/java/com/example/jhapcham/exception/GlobalExceptionHandler.java`

See the file `BACKEND_GlobalExceptionHandler.java` in your frontend project folder.

#### File 3: `ResourceNotFoundException.java`

```java
package com.example.jhapcham.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
```

#### File 4: `UnauthorizedException.java`

```java
package com.example.jhapcham.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
```

#### File 5: `ForbiddenException.java`

```java
package com.example.jhapcham.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
```

## How It Works

### Before (Current Behavior)

```
Backend throws: IllegalStateException: Only customers can use the cart
↓
Spring Boot logs it to console
↓
Frontend receives: 500 Internal Server Error (no details)
↓
Error page can't show details ❌
```

### After (With Global Exception Handler)

```
Backend throws: IllegalStateException: Only customers can use the cart
↓
GlobalExceptionHandler catches it
↓
Returns JSON:
{
  "status": 400,
  "message": "Invalid Operation",
  "details": "Only customers can use the cart",
  "timestamp": "2025-12-05T14:18:00",
  "path": "/api/cart/add"
}
↓
Frontend receives JSON error
↓
Error page displays all details ✅
```

## Testing

### Test 1: Cart Error (Your Current Issue)

```bash
# Try adding to cart as non-customer
# Before: Console error only
# After: JSON error response
```

Expected Response:

```json
{
  "status": 400,
  "message": "Invalid Operation",
  "details": "Only customers can use the cart",
  "timestamp": "2025-12-05T14:18:00",
  "path": "/api/cart/add"
}
```

### Test 2: Validation Error

```bash
# Submit form with invalid data
```

Expected Response:

```json
{
  "status": 400,
  "message": "Validation Failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  },
  "timestamp": "2025-12-05T14:18:00",
  "path": "/api/users/register"
}
```

### Test 3: Resource Not Found

```bash
# Request non-existent product
```

Expected Response:

```json
{
  "status": 404,
  "message": "Resource Not Found",
  "details": "Product not found with id: '12345'",
  "timestamp": "2025-12-05T14:18:00",
  "path": "/api/products/12345"
}
```

## Usage in Your Services

### Example 1: Cart Service (Fix Your Current Error)

```java
@Service
public class CartService {

    public void addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Instead of throwing IllegalStateException directly
        if (!user.getRole().equals(Role.CUSTOMER)) {
            // This will now be caught and returned as JSON
            throw new IllegalStateException("Only customers can use the cart");
        }

        // Rest of your code...
    }
}
```

### Example 2: Product Service

```java
@Service
public class ProductService {

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }
}
```

### Example 3: Authentication

```java
@Service
public class AuthService {

    public void validateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
}
```

### Example 4: Authorization

```java
@Service
public class OrderService {

    public Order getOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("You don't have permission to view this order");
        }

        return order;
    }
}
```

## Frontend Integration

Once the backend is updated, your frontend will automatically receive proper error responses:

```javascript
try {
  const response = await fetch(`${API_BASE}/api/cart/add`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    // Navigate to error page with details
    navigate("/error", {
      state: {
        error: errorData, // Now has all the details!
      },
    });
  }
} catch (error) {
  navigate("/backend-down");
}
```

## Benefits

1. ✅ **All errors are caught** - No more console-only errors
2. ✅ **Consistent format** - All errors follow the same JSON structure
3. ✅ **Frontend can display details** - Error page shows full information
4. ✅ **Better debugging** - Stack traces in development mode
5. ✅ **User-friendly** - Clear error messages for users
6. ✅ **Professional** - Proper HTTP status codes

## Checklist

- [ ] Create `exception` package in backend
- [ ] Add `ErrorResponse.java`
- [ ] Add `GlobalExceptionHandler.java`
- [ ] Add `ResourceNotFoundException.java`
- [ ] Add `UnauthorizedException.java`
- [ ] Add `ForbiddenException.java`
- [ ] Restart Spring Boot application
- [ ] Test cart error (should now show in error page)
- [ ] Test other errors
- [ ] Verify error page displays all details

## Next Steps

1. **Copy the files** from your frontend folder to your backend:

   - `BACKEND_ErrorResponse.java` → `src/main/java/com/example/jhapcham/exception/ErrorResponse.java`
   - `BACKEND_GlobalExceptionHandler.java` → `src/main/java/com/example/jhapcham/exception/GlobalExceptionHandler.java`
   - `BACKEND_ResourceNotFoundException.java` → `src/main/java/com/example/jhapcham/exception/ResourceNotFoundException.java`
   - `BACKEND_UnauthorizedException.java` → `src/main/java/com/example/jhapcham/exception/UnauthorizedException.java`
   - `BACKEND_ForbiddenException.java` → `src/main/java/com/example/jhapcham/exception/ForbiddenException.java`

2. **Restart your Spring Boot application**

3. **Test the cart error again** - It should now show on the error page!

## Result

After implementing this, when you try to add to cart as a non-customer:

**Before:**

- Console shows error
- Frontend shows generic 500 error
- No details on error page

**After:**

- Backend returns JSON error
- Frontend navigates to `/error`
- Error page shows:
  - Status: 400
  - Message: "Invalid Operation"
  - Details: "Only customers can use the cart"
  - Timestamp
  - Request path
  - All beautifully formatted! 🎉
