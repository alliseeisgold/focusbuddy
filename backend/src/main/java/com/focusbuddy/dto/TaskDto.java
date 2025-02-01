package com.focusbuddy.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
  private String title;
  private String description;
  private LocalDate dueDate;
  private Boolean isCompleted;
  private Boolean isCurrent;
}
