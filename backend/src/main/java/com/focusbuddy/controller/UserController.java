package com.focusbuddy.controller;

import com.focusbuddy.model.User;
import com.focusbuddy.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User currentUser) {
    return ResponseEntity.ok(currentUser);
  }

  @PutMapping("/update")
  public ResponseEntity<User> updateUser(
      @AuthenticationPrincipal User currentUser, @RequestBody User updatedUser) {
    User updated = userService.updateUser(currentUser, updatedUser);
    return ResponseEntity.ok(updated);
  }

  @GetMapping("/all")
  public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @DeleteMapping("/delete")
  public ResponseEntity<String> deleteUser(@AuthenticationPrincipal User currentUser) {
    userService.deleteUser(currentUser);
    return ResponseEntity.ok("User deleted successfully");
  }
}
