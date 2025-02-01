package com.focusbuddy.controller;

import com.focusbuddy.dto.AuthRequest;
import com.focusbuddy.dto.AuthResponse;
import com.focusbuddy.dto.RefreshRequest;
import com.focusbuddy.dto.SignUpRequest;
import com.focusbuddy.model.RefreshToken;
import com.focusbuddy.model.Role;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.UserRepository;
import com.focusbuddy.service.JwtService;
import com.focusbuddy.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final RefreshTokenService refreshTokenService;

  @PostMapping("/signup")
  public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request) {
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
      return ResponseEntity.badRequest()
          .body(new AuthResponse("Username already taken", null, null));
    }

    User user =
        User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .telegramId(request.getTelegramId())
            .role(request.getRole() != null ? request.getRole() : Role.USER) // Если null → USER
            .build();

    userRepository.save(user);

    String accessToken = jwtService.generateAccessToken(user);
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

    return ResponseEntity.ok(
        new AuthResponse("User registered", accessToken, refreshToken.getToken()));
  }

  @PostMapping("/signin")
  public ResponseEntity<AuthResponse> signin(@RequestBody AuthRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
    User user =
        userRepository
            .findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    String accessToken = jwtService.generateAccessToken(user);
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

    return ResponseEntity.ok(
        new AuthResponse("User logged in", accessToken, refreshToken.getToken()));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshRequest request) {
    String reqToken = request.getRefreshToken();
    RefreshToken storedToken =
        refreshTokenService
            .findByToken(reqToken)
            .orElseThrow(() -> new RuntimeException("Refresh token not found"));

    if (refreshTokenService.isRefreshTokenExpired(storedToken)) {
      throw new RuntimeException("Refresh token expired. Please login again.");
    }

    User user = storedToken.getUser();
    String newAccess = jwtService.generateAccessToken(user);
    RefreshToken newRefresh = refreshTokenService.createRefreshToken(user);

    return ResponseEntity.ok(new AuthResponse("Token refreshed", newAccess, newRefresh.getToken()));
  }
}
