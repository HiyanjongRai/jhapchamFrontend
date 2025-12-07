# Error Page Integration Guide

## Overview

The Error Page component provides a beautiful, modern error handling experience for your e-commerce site with support for multiple error types.

## Features

- ✨ **Multiple Error Types**: 404, 403, 500, Network errors
- 🎨 **Modern Design**: Glassmorphism, animations, and smooth transitions
- 📱 **Fully Responsive**: Works perfectly on all devices
- 🌓 **Dark/Light Mode**: Automatic theme detection
- 🎯 **User-Friendly**: Clear messaging and helpful navigation options
- ⚡ **Animated**: Floating backgrounds, glitch effects, and micro-animations

## Installation

### 1. Import the Error Page Components

Add to your `App.js`:

```javascript
import ErrorPage, {
  NotFoundPage,
  ForbiddenPage,
  ServerErrorPage,
  NetworkErrorPage,
} from "./components/ErrorPage/ErrorPage";
```

### 2. Add Routes

In your `App.js` routing configuration:

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Error Pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/network-error" element={<NetworkErrorPage />} />

        {/* 404 - Must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
```

## Usage Examples

### 1. Basic 404 Page (Automatic)

When a user navigates to a non-existent route, they'll automatically see the 404 error page.

### 2. Custom Error Page

```javascript
import ErrorPage from "./components/ErrorPage/ErrorPage";

<ErrorPage
  errorCode="404"
  errorTitle="Product Not Found"
  errorMessage="The product you're looking for is no longer available."
  showBackButton={true}
  showHomeButton={true}
/>;
```

### 3. Programmatic Navigation to Error Pages

```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleError = (errorType) => {
    switch(errorType) {
      case 'forbidden':
        navigate('/403');
        break;
      case 'server':
        navigate('/500');
        break;
      case 'network':
        navigate('/network-error');
        break;
      default:
        navigate('/404');
    }
  };

  return (
    // Your component
  );
};
```

### 4. Error Boundary Integration

```javascript
import React from "react";
import { ServerErrorPage } from "./components/ErrorPage/ErrorPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ServerErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

Then wrap your app:

```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 5. API Error Handling

```javascript
const fetchData = async () => {
  try {
    const response = await fetch("/api/data");

    if (!response.ok) {
      if (response.status === 403) {
        navigate("/403");
      } else if (response.status === 404) {
        navigate("/404");
      } else if (response.status >= 500) {
        navigate("/500");
      }
      return;
    }

    const data = await response.json();
    // Process data
  } catch (error) {
    // Network error
    navigate("/network-error");
  }
};
```

## Component Props

### ErrorPage Props

| Prop                | Type    | Default | Description                                    |
| ------------------- | ------- | ------- | ---------------------------------------------- |
| `errorCode`         | string  | '404'   | Error code to display (404, 403, 500, network) |
| `errorTitle`        | string  | Auto    | Custom error title                             |
| `errorMessage`      | string  | Auto    | Custom error message                           |
| `showBackButton`    | boolean | true    | Show "Go Back" button                          |
| `showHomeButton`    | boolean | true    | Show "Go Home" button                          |
| `showRefreshButton` | boolean | false   | Show "Refresh" button                          |

## Pre-configured Error Pages

### NotFoundPage (404)

- Shows when page doesn't exist
- Includes back and home buttons
- Suggests browsing products

### ForbiddenPage (403)

- Shows when user lacks permissions
- Suggests contacting support
- Includes back and home buttons

### ServerErrorPage (500)

- Shows for server errors
- Includes refresh and home buttons
- Reassures user that issue is being fixed

### NetworkErrorPage

- Shows for connection issues
- Includes refresh and home buttons
- Suggests checking internet connection

## Customization

### Custom Error Messages

```javascript
<ErrorPage
  errorCode="custom"
  errorTitle="Checkout Unavailable"
  errorMessage="Our checkout system is temporarily down for maintenance. Please try again in a few minutes."
  showRefreshButton={true}
/>
```

### Styling

Modify `ErrorPage.css` to match your brand:

- Change color scheme in gradient backgrounds
- Adjust animation speeds
- Modify button styles
- Update typography

## Best Practices

1. **Always have a catch-all 404 route** at the end of your routes
2. **Use Error Boundaries** to catch React errors
3. **Handle API errors gracefully** with appropriate error pages
4. **Provide helpful actions** (go home, refresh, contact support)
5. **Log errors** for debugging while showing friendly messages to users

## Testing

Test all error scenarios:

```javascript
// Test 404
navigate("/non-existent-page");

// Test 403
navigate("/403");

// Test 500
navigate("/500");

// Test Network Error
navigate("/network-error");
```

## Accessibility

The error page includes:

- Semantic HTML
- Keyboard navigation support
- Clear, readable text
- Sufficient color contrast
- Responsive design for all devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Error page not showing

- Check that routes are configured correctly
- Ensure ErrorPage component is imported
- Verify CSS file is imported

### Animations not working

- Check browser compatibility
- Ensure CSS animations are supported
- Try disabling browser extensions

### Buttons not working

- Verify react-router-dom is installed
- Check useNavigate hook is available
- Ensure routes exist for navigation

## Support

For issues or questions:

1. Check the console for errors
2. Verify all dependencies are installed
3. Review the integration guide
4. Contact development team
