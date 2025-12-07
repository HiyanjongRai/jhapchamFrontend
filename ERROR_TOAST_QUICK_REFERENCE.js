// ============================================
// QUICK REFERENCE: ErrorToast Integration
// ============================================

// 1. IMPORT
import ErrorToast from "../ErrorToast/ErrorToast";

// 2. STATE
const [error, setError] = useState(null);

// 3. JSX (at the top of your return)
return (
  <>
    <ErrorToast error={error} onClose={() => setError(null)} />
    
    {/* Your other components */}
  </>
);

// 4. ERROR HANDLING
try {
  await apiFunction();
  // Success
} catch (err) {
  // Display error
  if (err.status) {
    setError(err); // Structured error from API
  } else {
    setError({
      status: 500,
      message: "Operation Failed",
      details: err.message || "An unexpected error occurred",
      timestamp: new Date().toISOString()
    });
  }
}

// ============================================
// COMMON PATTERNS
// ============================================

// Pattern 1: Cart Operations
const handleAddToCart = async () => {
  try {
    setError(null); // Clear previous errors
    await apiAddToCart(userId, productId, quantity);
    setSuccessMessage("Added to cart!");
  } catch (err) {
    setError(err.status ? err : {
      status: 500,
      message: "Failed to Add Item",
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Pattern 2: Checkout
const handleCheckout = async () => {
  if (!userId) {
    setError({
      status: 401,
      message: "Authentication Required",
      details: "Please log in to continue",
      timestamp: new Date().toISOString()
    });
    return;
  }

  try {
    await apiPlaceOrder(userId, orderData);
    navigate("/order-success");
  } catch (err) {
    setError(err.status ? err : {
      status: 500,
      message: "Order Failed",
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Pattern 3: Form Validation
const handleSubmit = async (formData) => {
  try {
    const response = await fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError({
        status: response.status,
        message: errorData.message,
        details: errorData.details,
        errors: errorData.errors, // Field-specific errors
        timestamp: errorData.timestamp,
        path: errorData.path
      });
      return;
    }

    // Success
  } catch (err) {
    setError({
      status: 500,
      message: "Submission Failed",
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// ============================================
// CUSTOM DURATION
// ============================================

// Show for 10 seconds
<ErrorToast 
  error={error} 
  onClose={() => setError(null)} 
  duration={10000} 
/>

// Never auto-dismiss (user must click X)
<ErrorToast 
  error={error} 
  onClose={() => setError(null)} 
  duration={0} 
/>

// ============================================
// ERROR OBJECT STRUCTURE
// ============================================

{
  status: 400,           // HTTP status code
  message: "...",        // Main error message
  details: "...",        // Detailed explanation
  errors: {              // Field-specific errors (optional)
    email: "Email is required",
    password: "Password too short"
  },
  timestamp: "...",      // ISO timestamp
  path: "/api/..."       // API endpoint
}
