# Error Handling - Troubleshooting Guide

## Common Issues and Fixes

### Issue 1: Import Error in ErrorBoundary

**Error:** `Module not found: Can't resolve '../components/ErrorPage/ErrorPage'`

**Fix:** ✅ Already fixed!

```javascript
// Wrong
import { ServerErrorPage } from "../components/ErrorPage/ErrorPage";

// Correct
import { ServerErrorPage } from "../ErrorPage/ErrorPage";
```

### Issue 2: App Won't Compile

**Symptoms:** Blank page, compilation errors

**Check:**

1. Make sure all imports are correct
2. Check browser console for errors
3. Check terminal for compilation errors

**Quick Fix:**

```bash
# Stop the server (Ctrl+C)
# Clear cache and restart
npm start
```

### Issue 3: Error Pages Not Showing

**Symptoms:** Errors still show as alerts or blank pages

**Possible Causes:**

1. Axios interceptors not set up
2. Using regular `axios` instead of `api` instance
3. Backend not returning JSON errors

**Fix:**

1. Setup interceptors in App.js (see GLOBAL_ERROR_HANDLING_GUIDE.md)
2. Use `import api from '../api/axios'` instead of `import axios from 'axios'`
3. Add GlobalExceptionHandler to backend (see BACKEND_ERROR_SETUP_GUIDE.md)

### Issue 4: "Cannot read property 'navigate' of undefined"

**Error:** Navigation errors in error handler

**Fix:** Make sure you're using the error handler inside a component with `useNavigate`:

```javascript
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "../utils/errorHandler";

const MyComponent = () => {
  const navigate = useNavigate(); // Must have this
  const { handleApiError } = useApiErrorHandler();

  // Now you can use handleApiError
};
```

### Issue 5: Error Boundary Not Catching Errors

**Symptoms:** React errors not showing error page

**Check:**

1. Is ErrorBoundary wrapping your app in App.js?
2. Is the error happening during rendering?

**Verify App.js:**

```javascript
function App() {
  return (
    <ErrorBoundary>
      {" "}
      {/* Must wrap everything */}
      <Navbar />
      <Routes>{/* All routes */}</Routes>
    </ErrorBoundary>
  );
}
```

### Issue 6: Axios Interceptor Not Working

**Symptoms:** Errors not being caught automatically

**Check:**

1. Did you setup interceptors in App.js?
2. Are you using the `api` instance or regular `axios`?

**Setup in App.js:**

```javascript
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupAxiosInterceptors } from "./utils/errorHandler";
import api from "./api/axios";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(api, navigate);
  }, [navigate]);

  return <ErrorBoundary>{/* Your app */}</ErrorBoundary>;
}
```

**Use in components:**

```javascript
// Wrong - won't be caught
import axios from "axios";
await axios.get("/api/products");

// Correct - will be caught
import api from "../api/axios";
await api.get("/api/products");
```

### Issue 7: Backend Errors Not Showing Details

**Symptoms:** Error page shows but no details

**Cause:** Backend not returning proper JSON error response

**Fix:** Add GlobalExceptionHandler to your Spring Boot backend
See: `BACKEND_ERROR_SETUP_GUIDE.md`

### Issue 8: "Module not found" Errors

**Common missing modules:**

```bash
# If axios is not installed
npm install axios

# If react-router-dom is not installed
npm install react-router-dom

# If lucide-react is not installed
npm install lucide-react
```

## Quick Diagnostics

### Test 1: Check if Error Boundary Works

```javascript
// Add this to any component temporarily
const TestError = () => {
  throw new Error("Test error");
  return <div>Test</div>;
};

// If you see the ServerErrorPage, Error Boundary is working ✅
```

### Test 2: Check if API Error Handler Works

```javascript
import api from "../api/axios";

// Try this in any component
const testError = async () => {
  try {
    await api.get("/api/nonexistent-endpoint");
  } catch (error) {
    console.log("Error caught");
  }
};

// If you're redirected to error page, it's working ✅
```

### Test 3: Check Backend Error Response

```bash
# In browser console or Postman
fetch('http://localhost:8080/api/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: 1, quantity: 1 })
})
.then(r => r.json())
.then(console.log)

# Should return JSON like:
# {
#   "status": 400,
#   "message": "Invalid Operation",
#   "details": "Only customers can use the cart",
#   ...
# }
```

## File Checklist

Make sure these files exist:

- [x] `src/components/ErrorPage/ErrorPage.jsx`
- [x] `src/components/ErrorPage/ErrorPage.css`
- [x] `src/components/ErrorPage/BackendDownPage.jsx`
- [x] `src/components/ErrorPage/AllErrorsPage.jsx`
- [x] `src/components/ErrorBoundary/ErrorBoundary.jsx` ✅ Fixed
- [x] `src/utils/errorHandler.js`
- [x] `src/api/axios.js`
- [ ] Axios interceptors setup in App.js (optional but recommended)

## Still Having Issues?

1. **Check browser console** - Look for error messages
2. **Check terminal** - Look for compilation errors
3. **Clear cache** - Stop server, delete `node_modules/.cache`, restart
4. **Restart server** - `Ctrl+C` then `npm start`
5. **Check file paths** - Make sure all imports use correct relative paths

## Current Status

✅ **Fixed Issues:**

- ErrorBoundary import path corrected
- Error Boundary integrated in App.js
- All error page components created
- Error handler utilities created
- Axios instance created

⚠️ **Optional (Recommended):**

- Setup axios interceptors in App.js for automatic error handling
- Add GlobalExceptionHandler to Spring Boot backend

## Next Steps

1. **Test the error pages** - Navigate to `/404`, `/500`, etc.
2. **Test Error Boundary** - Throw an error in a component
3. **Setup axios interceptors** - Follow GLOBAL_ERROR_HANDLING_GUIDE.md
4. **Add backend error handler** - Follow BACKEND_ERROR_SETUP_GUIDE.md

Your error handling should be working now! 🎉
