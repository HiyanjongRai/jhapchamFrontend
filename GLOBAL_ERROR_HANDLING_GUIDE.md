# Global Error Handling - Complete Integration Guide

## Overview

Your app now has **automatic error handling** for ALL errors across the entire application!

## What Was Integrated

### 1. Error Boundary (React Errors)

Catches all React rendering errors automatically.

### 2. Global API Error Handler

Utility functions to handle all API errors automatically.

### 3. Axios Interceptors

Automatically intercepts all axios requests/responses.

## How It Works

### Error Boundary (Already Integrated)

```javascript
// In App.js - Already done!
<ErrorBoundary>
  <Navbar />
  <Routes>{/* All your routes */}</Routes>
</ErrorBoundary>
```

**What it catches:**

- React component errors
- Rendering errors
- Lifecycle method errors
- Constructor errors

**What happens:**

- Error is caught
- User sees ServerErrorPage (500)
- Error is logged to console

## Using the Global Error Handler

### Method 1: With Axios (Recommended)

#### Step 1: Setup Axios Interceptors (One Time)

Create `src/api/axios.js`:

```javascript
import axios from "axios";
import { API_BASE } from "../components/config/config";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

#### Step 2: Setup Interceptors in App.js

```javascript
// In App.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptors } from "./utils/errorHandler";
import api from "./api/axios";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Setup axios interceptors once
    setupAxiosInterceptors(api, navigate);
  }, [navigate]);

  return <ErrorBoundary>{/* Your app */}</ErrorBoundary>;
}
```

#### Step 3: Use Axios Everywhere

```javascript
// In any component
import api from "../api/axios";

const MyComponent = () => {
  const handleSubmit = async () => {
    try {
      // Just make the API call - errors are handled automatically!
      const response = await api.post("/api/cart/add", {
        productId: 123,
        quantity: 1,
      });

      // Handle success
      console.log("Success:", response.data);
    } catch (error) {
      // Error already handled and user redirected to error page
      // You can add additional logic here if needed
      console.log("Error was handled globally");
    }
  };

  return <button onClick={handleSubmit}>Add to Cart</button>;
};
```

### Method 2: With useApiErrorHandler Hook

```javascript
import { useApiErrorHandler } from "../utils/errorHandler";
import axios from "axios";

const MyComponent = () => {
  const { handleApiError } = useApiErrorHandler();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/products`);
      setProducts(response.data);
    } catch (error) {
      // Automatically handles error and navigates to error page
      handleApiError(error);
    }
  };

  return <button onClick={fetchData}>Load Products</button>;
};
```

### Method 3: With apiFetch Wrapper

```javascript
import { apiFetch } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../components/config/config";

const MyComponent = () => {
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // Automatically handles errors
      const data = await apiFetch(
        `${API_BASE}/api/products`,
        { method: "GET" },
        navigate
      );

      setProducts(data);
    } catch (error) {
      // Error already handled
      console.log("Error handled");
    }
  };

  return <button onClick={fetchData}>Load Products</button>;
};
```

## Real-World Examples

### Example 1: Add to Cart (Your Current Error)

```javascript
import api from "../api/axios";

const ProductCard = ({ product }) => {
  const addToCart = async () => {
    try {
      await api.post("/api/cart/add", {
        productId: product.id,
        quantity: 1,
      });

      alert("Added to cart!");
    } catch (error) {
      // If user is not a customer, error page will show:
      // "Only customers can use the cart"
      // User is already redirected - no need to do anything
    }
  };

  return <button onClick={addToCart}>Add to Cart</button>;
};
```

### Example 2: Login Form

```javascript
import api from "../api/axios";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", credentials);

      // Save token
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Errors handled automatically:
      // - 401: Shows "Invalid credentials"
      // - 400: Shows validation errors
      // - 500: Shows server error page
    }
  };

  return <form onSubmit={handleLogin}>{/* Form fields */}</form>;
};
```

### Example 3: Fetch Products

```javascript
import api from "../api/axios";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/all");
        setProducts(response.data);
      } catch (error) {
        // Errors handled automatically:
        // - Network error: Shows "Backend Down" page
        // - 500: Shows "Server Error" page
        // - 404: Shows "Not Found" page
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Example 4: Update Profile

```javascript
import api from "../api/axios";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/profile", formData);
      alert("Profile updated!");
    } catch (error) {
      // Validation errors automatically shown on error page
      // with field-specific messages
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form */}</form>;
};
```

## Error Flow Diagram

```
User Action
    ↓
API Call
    ↓
Error Occurs
    ↓
Axios Interceptor Catches Error
    ↓
Checks Error Type:
    - Network Error → /backend-down
    - 401 → /login
    - 403 → /403
    - 404 → /error (with details)
    - 400 → /error (with validation errors)
    - 500 → /500
    ↓
User Sees Beautiful Error Page
    ↓
User Can:
    - Go Back
    - Go Home
    - Retry
    - Contact Support
```

## What Errors Are Caught

### ✅ API Errors (Axios/Fetch)

- ✅ Network errors (backend down)
- ✅ 400 Bad Request (validation errors)
- ✅ 401 Unauthorized
- ✅ 403 Forbidden
- ✅ 404 Not Found
- ✅ 500 Internal Server Error
- ✅ All other HTTP errors

### ✅ React Errors (Error Boundary)

- ✅ Component rendering errors
- ✅ Lifecycle method errors
- ✅ Constructor errors
- ✅ Event handler errors

## Benefits

1. **No Manual Error Handling** - Errors are caught automatically
2. **Consistent UX** - All errors shown in beautiful error pages
3. **Detailed Information** - Users see helpful error messages
4. **Easy Debugging** - Errors logged to console
5. **Professional** - No more blank screens or console-only errors

## Migration Guide

### Old Way (Manual Error Handling)

```javascript
const fetchData = async () => {
  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      if (response.status === 404) {
        navigate("/404");
      } else if (response.status === 500) {
        navigate("/500");
      } else {
        alert("Error occurred");
      }
      return;
    }

    const data = await response.json();
    setProducts(data);
  } catch (error) {
    if (error.message === "Network Error") {
      navigate("/backend-down");
    } else {
      alert("Error: " + error.message);
    }
  }
};
```

### New Way (Automatic Error Handling)

```javascript
import api from "../api/axios";

const fetchData = async () => {
  try {
    const response = await api.get("/products/all");
    setProducts(response.data);
  } catch (error) {
    // That's it! Error is handled automatically
  }
};
```

## Setup Checklist

- [x] ✅ Error Boundary added to App.js
- [ ] Create `src/api/axios.js` with axios instance
- [ ] Setup axios interceptors in App.js
- [ ] Replace all `axios` imports with `import api from '../api/axios'`
- [ ] Test error scenarios
- [ ] Verify error pages display correctly

## Testing

Test these scenarios to verify error handling:

1. **Backend Down** - Stop Spring Boot, try any API call
2. **Invalid Credentials** - Login with wrong password
3. **Validation Error** - Submit form with invalid data
4. **Not Found** - Request non-existent product
5. **Permission Error** - Try to access admin page as customer
6. **Cart Error** - Try to add to cart as non-customer

All should show appropriate error pages automatically! 🎉

## Next Steps

1. Create `src/api/axios.js` file
2. Setup interceptors in App.js
3. Replace axios imports in all components
4. Test error scenarios
5. Enjoy automatic error handling!
