package com.focusbuddy.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Table(name = "refresh_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "token", nullable = false, unique = true)
  private String token;

  // Срок действия (в unix timestamp или любой другой формат)
  @Column(name = "expiry_date", nullable = false)
  private Instant expiryDate;

  // Привязка к пользователю (Optional: если хотим чётко знать, кому принадлежит этот refresh)
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}
