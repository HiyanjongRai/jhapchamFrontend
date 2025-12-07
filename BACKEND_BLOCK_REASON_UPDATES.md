# Backend Updates Required for Block/Unblock with Reason

## Overview

The frontend Admin Dashboard now includes a modal dialog that collects a reason when blocking users. The backend needs to be updated to accept and store this block reason.

## Required Backend Changes

### 1. Update User Model

Add a `blockReason` field to the User entity:

```java
@Entity
@Table(name = "users")
public class User {
    // ... existing fields ...

    @Column(name = "block_reason", length = 500)
    private String blockReason;

    // Getter and Setter
    public String getBlockReason() {
        return blockReason;
    }

    public void setBlockReason(String blockReason) {
        this.blockReason = blockReason;
    }
}
```

### 2. Update AdminService

Modify the `blockUser` method to accept and store the block reason:

```java
/** Block a user with reason */
public User blockUser(Long userId, String reason) {
    User user = adminRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setStatus(Status.BLOCKED);
    user.setBlockReason(reason);  // Store the block reason
    return adminRepository.save(user);
}

/** Unblock a user */
public User unblockUser(Long userId) {
    User user = adminRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setStatus(Status.ACTIVE);
    user.setBlockReason(null);  // Clear the block reason when unblocking
    return adminRepository.save(user);
}
```

### 3. Update AdminController

Modify the block endpoint to accept a request body with the reason:

```java
@PostMapping("/users/{userId}/block")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> blockUser(
        @PathVariable Long userId,
        @RequestBody Map<String, String> requestBody) {

    String reason = requestBody.get("reason");

    if (reason == null || reason.trim().isEmpty()) {
        return ResponseEntity.badRequest().body(
            Map.of("message", "Block reason is required")
        );
    }

    User user = adminService.blockUser(userId, reason);
    return ResponseEntity.ok(Map.of(
            "message", "User blocked successfully",
            "userId", user.getId(),
            "status", user.getStatus().name(),
            "blockReason", user.getBlockReason()
    ));
}

@PostMapping("/users/{userId}/unblock")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> unblockUser(@PathVariable Long userId) {
    User user = adminService.unblockUser(userId);
    return ResponseEntity.ok(Map.of(
            "message", "User unblocked successfully",
            "userId", user.getId(),
            "status", user.getStatus().name()
    ));
}
```

### 4. Update AdminUserDTO

Add the blockReason field to the DTO:

```java
@Data
@Builder
public class AdminUserDTO {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String contactNumber;
    private Role role;
    private Status status;
    private String blockReason;  // Add this field
}
```

### 5. Update the mapping in AdminController's getAllUsers method:

```java
@GetMapping("/users")
public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
    List<AdminUserDTO> users = adminService.getAllUsers()
            .stream()
            .map(u -> AdminUserDTO.builder()
                    .userId(u.getId())
                    .username(u.getUsername())
                    .fullName(u.getFullName())
                    .email(u.getEmail())
                    .contactNumber(u.getContactNumber())
                    .role(u.getRole())
                    .status(u.getStatus())
                    .blockReason(u.getBlockReason())  // Include block reason
                    .build())
            .sorted(Comparator.comparing(AdminUserDTO::getFullName,
                    Comparator.nullsLast(String::compareToIgnoreCase)))
            .collect(Collectors.toList());

    return ResponseEntity.ok(users);
}
```

## Database Migration

You'll need to add a migration to add the `block_reason` column to the users table:

```sql
ALTER TABLE users ADD COLUMN block_reason VARCHAR(500);
```

## Frontend API Calls

The frontend now makes the following API calls:

### Block User (with reason)

```javascript
POST /api/admin/users/{userId}/block
Content-Type: application/json

{
  "reason": "User violated terms of service"
}
```

### Unblock User

```javascript
POST / api / admin / users / { userId } / unblock;
```

## Testing Checklist

- [ ] Block a user with a reason - verify reason is stored
- [ ] Unblock a user - verify reason is cleared
- [ ] View blocked user in user list - verify reason is displayed
- [ ] Attempt to block without reason - verify validation error
- [ ] Verify blocked users cannot login (existing functionality)

## Notes

- The block reason is required on the frontend (modal validation)
- The block reason is cleared when a user is unblocked
- Maximum length for block reason is 500 characters
- The block reason is returned in the user list API for display purposes
