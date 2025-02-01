package com.focusbuddy.dto;

import com.focusbuddy.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {
  private String username;
  private String password;
  private String telegramId;
  private Role role;
}
