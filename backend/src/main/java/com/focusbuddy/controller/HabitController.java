package com.focusbuddy.controller;

import com.focusbuddy.dto.HabitDto;
import com.focusbuddy.model.Habit;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.UserRepository;
import com.focusbuddy.service.HabitService;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController("/api/v1/habits")
@RequiredArgsConstructor
public class HabitController {
  private final HabitService habitService;
  private final UserRepository userRepository;

  @GetMapping
  public ResponseEntity<List<Habit>> getAllHabits(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    return ResponseEntity.ok(habitService.getAllHabitsByUser(currentUser));
  }

  @GetMapping("/good")
  public ResponseEntity<List<Habit>> getGoodHabits(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    var habits = habitService.getGoodHabitsByUser(currentUser);
    return ResponseEntity.ok(habits);
  }

  @GetMapping("/bad")
  public ResponseEntity<List<Habit>> getBadHabits(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    var habits = habitService.getBadHabitsByUser(currentUser);
    return ResponseEntity.ok(habits);
  }

  @PostMapping("/add")
  public ResponseEntity<Habit> createHabit(
      @AuthenticationPrincipal User currentUser, @RequestBody HabitDto habitDto) {
    Habit habit =
        Habit.builder()
            .title(habitDto.getTitle())
            .description(habitDto.getDescription())
            .type(habitDto.getType())
            .user(currentUser)
            .build();
    Habit createdHabit = habitService.createHabit(habit, currentUser);
    return ResponseEntity.ok(createdHabit);
  }
}
