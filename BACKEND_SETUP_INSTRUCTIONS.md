# Backend Setup Instructions - Fix "Insufficient Stock" Error Display

## 🎯 Problem

Your backend is throwing `IllegalStateException: Insufficient stock` but it's only being logged to the console. The frontend can't display it because it's not being returned as a JSON response.

## ✅ Solution

Add a **Global Exception Handler** to your Spring Boot backend that catches ALL exceptions and returns them as JSON.

---

## 📋 Step-by-Step Instructions

### Step 1: Create Exception Package

In your Spring Boot project, create a new package:

```
src/main/java/com/example/jhapcham/exception/
```

### Step 2: Add These 5 Files

Copy these files from your frontend project folder to your backend:

#### 1. `ErrorResponse.java`

**Location:** `src/main/java/com/example/jhapcham/exception/ErrorResponse.java`

**File:** Copy from `BACKEND_ErrorResponse.java` in your frontend folder

#### 2. `GlobalExceptionHandler.java`

**Location:** `src/main/java/com/example/jhapcham/exception/GlobalExceptionHandler.java`

**File:** Copy from `BACKEND_GlobalExceptionHandler.java` in your frontend folder

#### 3. `ResourceNotFoundException.java`

**Location:** `src/main/java/com/example/jhapcham/exception/ResourceNotFoundException.java`

**File:** Copy from `BACKEND_ResourceNotFoundException.java` in your frontend folder

#### 4. `UnauthorizedException.java`

**Location:** `src/main/java/com/example/jhapcham/exception/UnauthorizedException.java`

**File:** Copy from `BACKEND_UnauthorizedException.java` in your frontend folder

#### 5. `ForbiddenException.java`

**Location:** `src/main/java/com/example/jhapcham/exception/ForbiddenException.java`

**File:** Copy from `BACKEND_ForbiddenException.java` in your frontend folder

---

## 🔄 Step 3: Restart Your Backend

After adding these files:

1. Stop your Spring Boot application
2. Rebuild the project
3. Start the application again

---

## ✅ Step 4: Test It!

### Before (Current Behavior)

```
Backend Console:
2025-12-05T19:40:30.281+05:45  WARN 21824 --- [nio-8080-exec-7]
.m.m.a.ExceptionHandlerExceptionResolver : Resolved
[java.lang.IllegalStateException: Insufficient stock]

Frontend:
Basic alert box with no details ❌
```

### After (With GlobalExceptionHandler)

```
Backend Returns JSON:
{
  "status": 400,
  "message": "Invalid Operation",
  "details": "Insufficient stock",
  "timestamp": "2025-12-05T19:40:30",
  "path": "/api/cart/add"
}

Frontend:
Beautiful error popup with full details ✅
```

---

## 🎨 What the Frontend Will Show

Once the backend is updated, the ErrorToast component (already implemented in your frontend) will display:

```
┌─────────────────────────────────────────┐
│ ⚠️  Invalid Operation        Status: 400│
│                                      ✕  │
├─────────────────────────────────────────┤
│ Insufficient stock                      │
├─────────────────────────────────────────┤
│ 🕐 2025-12-05 19:40:30                  │
│ /api/cart/add                           │
└─────────────────────────────────────────┘
```

---

## 📝 How It Works

### Current Flow (Broken)

```
User clicks "Add to Cart"
        ↓
Backend throws IllegalStateException
        ↓
Spring logs to console only
        ↓
Frontend receives generic 500 error
        ↓
Basic alert box ❌
```

### New Flow (Fixed)

```
User clicks "Add to Cart"
        ↓
Backend throws IllegalStateException
        ↓
GlobalExceptionHandler catches it
        ↓
Returns JSON error response
        ↓
Frontend receives structured error
        ↓
ErrorToast displays beautiful popup ✅
```

---

## 🔍 Verification

After restarting your backend, check the console when the error occurs:

### Before

```
WARN ... ExceptionHandlerExceptionResolver : Resolved [java.lang.IllegalStateException: Insufficient stock]
```

### After

```
No warning! The exception is handled and returned as JSON.
```

---

## 💡 Additional Benefits

Once you add the GlobalExceptionHandler, it will handle ALL errors:

- ✅ **Insufficient stock** → 400 Bad Request
- ✅ **Product not found** → 404 Not Found
- ✅ **Unauthorized access** → 401 Unauthorized
- ✅ **Validation errors** → 400 with field details
- ✅ **Server errors** → 500 Internal Server Error

All will be displayed beautifully in the frontend!

---

## 🚨 Important Notes

1. **Package Name**: Make sure to update the package name in all files if your project uses a different package structure (e.g., `com.yourcompany.yourproject.exception`)

2. **Lombok**: The `ErrorResponse.java` uses Lombok annotations (`@Data`, `@Builder`, etc.). Make sure Lombok is in your `pom.xml`:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

3. **No Code Changes Needed**: You don't need to change your existing service code. The GlobalExceptionHandler will automatically catch all exceptions!

---

## 🎉 Result

After this setup:

- ✅ All backend errors will be returned as JSON
- ✅ Frontend will display them in beautiful popups
- ✅ Users will see helpful error messages
- ✅ No more mysterious "Order failed" alerts!

**Your error handling will be professional and user-friendly! 🚀**
