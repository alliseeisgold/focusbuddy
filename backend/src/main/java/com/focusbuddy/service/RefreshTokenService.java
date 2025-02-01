package com.focusbuddy.service;

import com.focusbuddy.model.RefreshToken;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.RefreshTokenRepository;
import com.focusbuddy.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtService jwtService;
  private final UserRepository userRepository;

  // Сколько живёт refresh-токен, в секундах (например, 7 дней)
  @Value("${security.jwt.refresh.expiration}")
  private Long refreshTokenDurationSec;

  /** Создаём и сохраняем refresh-токен для пользователя. */
  @Transactional
  public RefreshToken createRefreshToken(User user) {
    deleteByUser(user); // удаляем предыдущие токены пользователя
    var token = jwtService.generateRefreshToken(user);
    RefreshToken refreshToken =
        RefreshToken.builder()
            .user(user)
            .token(token)
            .expiryDate(Instant.now().plusSeconds(refreshTokenDurationSec))
            .build();

    return refreshTokenRepository.save(refreshToken);
  }

  /** Проверить, не просрочен ли токен. */
  public boolean isRefreshTokenExpired(RefreshToken token) {
    return token.getExpiryDate().isBefore(Instant.now());
  }

  /** Найти refresh-токен в БД */
  public Optional<RefreshToken> findByToken(String token) {
    return refreshTokenRepository.findByToken(token);
  }

  /** Удалить refresh-токен (по желанию, если делаете логаут). */
  public void deleteRefreshToken(RefreshToken token) {
    refreshTokenRepository.delete(token);
  }

  @Transactional
  public void deleteByUser(User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
      refreshTokenRepository.deleteByUser(user);
    }
  }
}
