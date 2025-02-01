package com.focusbuddy.dto;

import com.focusbuddy.model.HabitType;
import lombok.Data;

@Data
public class HabitDto {
  private String title;
  private String description;
  private HabitType type;
}
