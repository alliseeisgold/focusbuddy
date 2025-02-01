package com.focusbuddy.repository;

import com.focusbuddy.model.RefreshToken;
import com.focusbuddy.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

  // Находим refresh-токен по его строковому представлению.
  Optional<RefreshToken> findByToken(String token);

  // Можем добавить методы удаления, если нужно.
  void deleteByUser(User user);
}
