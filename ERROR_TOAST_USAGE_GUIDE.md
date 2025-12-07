# Error Toast Component - Usage Guide

## Overview

The **ErrorToast** component is a beautiful, modern popup notification system that displays backend errors properly. It replaces generic `alert()` calls with a professional error display.

## ✅ What's Been Fixed

### Before

```
Backend: IllegalStateException: Insufficient stock
↓
Console: Error logged
↓
Frontend: alert("Order failed") ❌
```

### After

```
Backend: IllegalStateException: Insufficient stock
↓
Backend returns JSON: { status: 400, message: "Invalid Operation", details: "Insufficient stock" }
↓
Frontend: Beautiful popup with all details ✅
```

## 📁 Files Created

1. **`src/components/ErrorToast/ErrorToast.jsx`** - The toast component
2. **`src/components/ErrorToast/ErrorToast.css`** - Styling
3. **Updated `src/components/AddCart/cartUtils.js`** - Proper error parsing
4. **Updated `src/components/Checkout/CheckoutPage.jsx`** - Uses ErrorToast
5. **Updated `src/components/productCard/ProductDetailPage.jsx`** - Uses ErrorToast

## 🎨 Features

- ✅ **Beautiful Design** - Modern, professional popup
- ✅ **Auto-dismiss** - Closes after 5 seconds (configurable)
- ✅ **Manual Close** - Click X to close immediately
- ✅ **Full Error Details** - Shows status, message, details, timestamp, path
- ✅ **Validation Errors** - Displays field-specific errors
- ✅ **Color-coded** - Different colors for different error types
- ✅ **Responsive** - Works on mobile and desktop
- ✅ **Animations** - Smooth fade-in and slide-in effects

## 📖 How to Use

### Step 1: Import the Component

```javascript
import ErrorToast from "../ErrorToast/ErrorToast";
```

### Step 2: Add Error State

```javascript
const [error, setError] = useState(null);
```

### Step 3: Add Component to JSX

```javascript
return (
  <>
    <ErrorToast error={error} onClose={() => setError(null)} />

    {/* Your other components */}
  </>
);
```

### Step 4: Set Error on API Failure

```javascript
try {
  const response = await apiAddToCart(userId, productId, quantity);
  // Success handling
} catch (err) {
  console.error("API Error:", err);

  // If it's a structured error from our updated API functions
  if (err.status) {
    setError(err);
  } else {
    // Generic error
    setError({
      status: 500,
      message: "Operation Failed",
      details: err.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    });
  }
}
```

## 🔧 API Functions Updated

All these functions now throw structured error objects:

- `apiAddToCart()`
- `apiGetCart()`
- `apiUpdateQuantity()`
- `apiRemoveItem()`
- `apiPlaceOrderFromCart()`

### Example Error Object

```javascript
{
  status: 400,
  message: "Invalid Operation",
  details: "Insufficient stock",
  errors: {}, // Field-specific validation errors
  timestamp: "2025-12-05T14:18:00",
  path: "/api/cart/add",
  trace: "..." // Stack trace (only in development)
}
```

## 🎯 Error Types & Colors

| Status Code | Type         | Icon | Color  |
| ----------- | ------------ | ---- | ------ |
| 500+        | Server Error | 🔥   | Red    |
| 404         | Not Found    | 🔍   | Orange |
| 403         | Forbidden    | 🚫   | Red    |
| 401         | Unauthorized | 🔒   | Orange |
| 400         | Validation   | ⚠️   | Orange |
| Other       | Generic      | ❌   | Red    |

## 📝 Props

| Prop       | Type     | Default  | Description                                       |
| ---------- | -------- | -------- | ------------------------------------------------- |
| `error`    | Object   | `null`   | Error object to display                           |
| `onClose`  | Function | Required | Callback when toast is closed                     |
| `duration` | Number   | `5000`   | Auto-dismiss duration in ms (0 = no auto-dismiss) |

## 🌟 Examples

### Example 1: Cart Error (Insufficient Stock)

```javascript
const handleAddToCart = async () => {
  try {
    await apiAddToCart(userId, productId, quantity);
    alert("Added to cart!");
  } catch (err) {
    setError(err); // Will show: "Insufficient stock"
  }
};
```

**Result:**

```
┌─────────────────────────────────────────┐
│ ⚠️  Invalid Operation        Status: 400│
│                                      ✕  │
├─────────────────────────────────────────┤
│ Insufficient stock                      │
├─────────────────────────────────────────┤
│ 🕐 2025-12-05 14:18:00                  │
│ /api/cart/add                           │
└─────────────────────────────────────────┘
```

### Example 2: Validation Errors

```javascript
// Backend returns:
{
  status: 400,
  message: "Validation Failed",
  errors: {
    email: "Email is required",
    password: "Password must be at least 8 characters"
  }
}

// Frontend:
setError(backendError);
```

**Result:**

```
┌─────────────────────────────────────────┐
│ ⚠️  Validation Failed        Status: 400│
│                                      ✕  │
├─────────────────────────────────────────┤
│ Validation Errors:                      │
│ • email: Email is required              │
│ • password: Password must be at least   │
│   8 characters                          │
└─────────────────────────────────────────┘
```

### Example 3: Custom Duration

```javascript
// Show error for 10 seconds
<ErrorToast
  error={error}
  onClose={() => setError(null)}
  duration={10000}
/>

// Never auto-dismiss
<ErrorToast
  error={error}
  onClose={() => setError(null)}
  duration={0}
/>
```

## 🚀 Quick Integration Checklist

For any component that makes API calls:

- [ ] Import `ErrorToast` component
- [ ] Add `const [error, setError] = useState(null);`
- [ ] Add `<ErrorToast error={error} onClose={() => setError(null)} />` to JSX
- [ ] Replace `alert()` calls with `setError()`
- [ ] Wrap API calls in try-catch
- [ ] Set error in catch block

## 🔄 Migration Guide

### Old Code

```javascript
try {
  await apiAddToCart(userId, productId, quantity);
  alert("Added!");
} catch (e) {
  alert("Failed to add");
}
```

### New Code

```javascript
const [error, setError] = useState(null);

// In JSX:
<ErrorToast error={error} onClose={() => setError(null)} />;

// In handler:
try {
  await apiAddToCart(userId, productId, quantity);
  setMessage("Added!"); // Use a success message instead
} catch (err) {
  setError(
    err.status
      ? err
      : {
          status: 500,
          message: "Failed to Add",
          details: err.message,
          timestamp: new Date().toISOString(),
        }
  );
}
```

## 🎨 Customization

### Change Colors

Edit `ErrorToast.css`:

```css
/* Change error color */
.error-toast {
  border-left-color: #your-color;
}

/* Change icon background */
.error-toast-icon {
  background-color: #your-color;
}
```

### Change Animation Duration

Edit `ErrorToast.css`:

```css
@keyframes slideIn {
  /* Adjust timing */
}
```

## 🐛 Troubleshooting

### Error not showing?

1. Check that `error` state is not `null`
2. Verify `ErrorToast` is rendered in JSX
3. Check console for errors

### Error shows but no details?

1. Verify backend is returning JSON error responses
2. Check that backend has `GlobalExceptionHandler` (see `BACKEND_ERROR_SETUP_GUIDE.md`)
3. Verify `cartUtils.js` is parsing errors correctly

### Toast doesn't auto-dismiss?

1. Check `duration` prop (default is 5000ms)
2. Verify `onClose` callback is provided
3. Check for JavaScript errors in console

## 📚 Related Files

- `BACKEND_ERROR_SETUP_GUIDE.md` - Backend setup instructions
- `BACKEND_ErrorResponse.java` - Backend error response model
- `BACKEND_GlobalExceptionHandler.java` - Backend exception handler

## 🎉 Result

Now when backend errors occur, users see:

✅ **Professional error messages** instead of generic alerts
✅ **Full error details** including status, message, and timestamp
✅ **Field-specific validation errors** when applicable
✅ **Beautiful animations** and smooth transitions
✅ **Auto-dismiss** after 5 seconds
✅ **Manual close** option

No more mysterious "Order failed" alerts! 🎊
