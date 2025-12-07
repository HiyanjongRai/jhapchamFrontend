# Error Pages - Quick Reference

## All Available Error Pages

Your app now has **4 error pages** configured and ready to use!

### 1. 404 - Page Not Found ⭐

**Route:** Automatic (catches all undefined routes)
**URL:** Any non-existent page (e.g., `/random-page`)

**When to use:**

- User navigates to a page that doesn't exist
- Product ID not found
- Category doesn't exist

**Example:**

```javascript
// Automatically shown for undefined routes
// No code needed - it's the catch-all route
```

---

### 2. 403 - Forbidden / Access Denied 🚫

**Route:** `/403`

**When to use:**

- User tries to access admin panel without permissions
- Seller tries to access another seller's dashboard
- Customer tries to access seller-only features

**Example:**

```javascript
// In your component
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Check permissions
if (userRole !== "ADMIN") {
  navigate("/403");
}

// Or in API response
if (response.status === 403) {
  navigate("/403");
}
```

---

### 3. 500 - Server Error ⚠️

**Route:** `/500`

**When to use:**

- Backend server crashes
- Database connection fails
- Internal server errors

**Example:**

```javascript
try {
  const response = await fetch("/api/products");

  if (response.status === 500) {
    navigate("/500");
  }
} catch (error) {
  console.error("Server error:", error);
  navigate("/500");
}
```

---

### 4. Network Error 📡

**Route:** `/network-error`

**When to use:**

- No internet connection
- API server is down
- Request timeout
- CORS errors

**Example:**

```javascript
try {
  const response = await fetch("/api/data");
  // ... handle response
} catch (error) {
  // Network error - no response from server
  if (!error.response) {
    navigate("/network-error");
  }
}
```

---

## Testing Error Pages

You can test each error page by navigating to these URLs:

1. **404 Page:** `http://localhost:3000/this-page-does-not-exist`
2. **403 Page:** `http://localhost:3000/403`
3. **500 Page:** `http://localhost:3000/500`
4. **Network Error:** `http://localhost:3000/network-error`

---

## Common Use Cases

### Example 1: Product Not Found

```javascript
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (response.status === 404) {
          navigate("/404"); // Or just navigate('*')
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        navigate("/network-error");
      }
    };

    fetchProduct();
  }, [id]);
};
```

### Example 2: Protected Admin Route

```javascript
const AdminDashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'ADMIN') {
      navigate('/403');
    }
  }, []);

  return (
    // Admin dashboard content
  );
};
```

### Example 3: API Error Handling

```javascript
const fetchData = async () => {
  try {
    const response = await axios.get("/api/data");

    // Handle different error codes
    if (!response.ok) {
      switch (response.status) {
        case 403:
          navigate("/403");
          break;
        case 404:
          navigate("/404");
          break;
        case 500:
        case 502:
        case 503:
          navigate("/500");
          break;
        default:
          console.error("Unknown error");
      }
    }

    return response.data;
  } catch (error) {
    // Network error (no response)
    if (error.message === "Network Error") {
      navigate("/network-error");
    }
  }
};
```

### Example 4: Global Error Handler

```javascript
// Create a utility function
export const handleApiError = (error, navigate) => {
  if (!error.response) {
    // Network error
    navigate("/network-error");
  } else {
    // HTTP error
    switch (error.response.status) {
      case 403:
        navigate("/403");
        break;
      case 404:
        navigate("/404");
        break;
      case 500:
      case 502:
      case 503:
        navigate("/500");
        break;
      default:
        console.error("Error:", error);
    }
  }
};

// Use it anywhere
try {
  await api.call();
} catch (error) {
  handleApiError(error, navigate);
}
```

---

## Error Page Features

Each error page includes:

- ✨ **Animated background** with floating circles
- 🎨 **Glassmorphism design** with blur effects
- 📱 **Fully responsive** for all devices
- 🎯 **Action buttons:**
  - Go Back (returns to previous page)
  - Go Home (navigates to homepage)
  - Refresh (reloads the page)
- 🔗 **Quick links:**
  - Browse Products
  - Contact Support
- 🌓 **Dark/Light mode** support
- ⚡ **Smooth animations** and transitions

---

## Tips

1. **Always handle errors gracefully** - Don't let users see raw error messages
2. **Log errors for debugging** - Use console.error() before redirecting
3. **Provide helpful actions** - Give users ways to recover
4. **Test error scenarios** - Make sure error pages work correctly
5. **Monitor error frequency** - Track which errors happen most often

---

## Error Page URLs

- 404: Automatic (any undefined route)
- 403: `/403`
- 500: `/500`
- Network: `/network-error`

All error pages are now active and ready to use! 🎉
