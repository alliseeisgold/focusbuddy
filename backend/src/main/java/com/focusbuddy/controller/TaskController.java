package com.focusbuddy.controller;

import com.focusbuddy.dto.TaskDto;
import com.focusbuddy.model.Task;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.UserRepository;
import com.focusbuddy.service.TaskService;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService taskService;
  private final UserRepository userRepository;

  @GetMapping
  public ResponseEntity<List<Task>> getTasks(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    return ResponseEntity.ok(taskService.getAllTasksForUser(currentUser));
  }

  @PostMapping("/current")
  public ResponseEntity<Task> createTodayTask(
      @AuthenticationPrincipal User currentUser, @RequestBody TaskDto taskDto) {
    Task task =
        Task.builder()
            .title(taskDto.getTitle())
            .description(taskDto.getDescription())
            .dueDate(LocalDate.now())
            .isCompleted(false)
            .isCurrent(true)
            .user(currentUser)
            .build();
    Task createdTask = taskService.createTask(task, currentUser);
    return ResponseEntity.ok(createdTask);
  }

  @PostMapping("/planned")
  public ResponseEntity<Task> createPlannedTask(
      @AuthenticationPrincipal User currentUser, @RequestBody TaskDto taskDto) {
    // Проверяем, что переданная дата больше сегодняшней
    if (taskDto.getDueDate() == null || !taskDto.getDueDate().isAfter(LocalDate.now())) {
      throw new IllegalArgumentException("Для планируемой задачи дата должна быть в будущем.");
    }
    Task task = new Task();
    task.setTitle(taskDto.getTitle());
    task.setDescription(taskDto.getDescription());
    task.setDueDate(taskDto.getDueDate());
    task.setIsCompleted(false);
    task.setIsCurrent(false);
    task.setUser(currentUser);

    Task createdTask = taskService.createTask(task, currentUser);
    return ResponseEntity.ok(createdTask);
  }

  @GetMapping("/current")
  public ResponseEntity<List<Task>> getCurrentTasks(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    var tasks = taskService.getCurrentTasksForUser(currentUser);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("/planned")
  public ResponseEntity<List<Task>> getPlannedTasks(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    var tasks = taskService.getPlannedTasksForUser(currentUser);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("/tomorrow")
  public ResponseEntity<List<Task>> getTomorrowTasks(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    var tasks = taskService.getTomorrowDeadlineTasksForUser(currentUser);
    return ResponseEntity.ok(tasks);
  }

  @GetMapping("/completed")
  public ResponseEntity<List<Task>> getCompletedTasks(@AuthenticationPrincipal User currentUser) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
    }
    var tasks = taskService.getCompletedTasksForUser(currentUser);
    return ResponseEntity.ok(tasks);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateTask(
      @AuthenticationPrincipal User currentUser,
      @PathVariable Long id,
      @RequestBody TaskDto taskDto) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    Task existingTask =
        taskService
            .getTaskByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Task not found or access denied"));
    if (taskDto.getTitle() != null) {
      existingTask.setTitle(taskDto.getTitle());
    }
    if (taskDto.getDescription() != null) {
      existingTask.setDescription(taskDto.getDescription());
    }
    if (taskDto.getDueDate() != null) {
      if (existingTask.getIsCurrent()) {
        existingTask.setDueDate(LocalDate.now());
      } else {
        if (taskDto.getDueDate().isAfter(LocalDate.now())) {
          existingTask.setDueDate(taskDto.getDueDate());
        } else {
          return ResponseEntity.badRequest()
              .body("For planned tasks the due date must be in the future");
        }
      }
    }
    if (taskDto.getIsCompleted() != null) {
      existingTask.setIsCompleted(taskDto.getIsCompleted());
    }
    Task updatedTask = taskService.updateTask(existingTask);
    return ResponseEntity.ok(updatedTask);
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteTask(
      @AuthenticationPrincipal User currentUser, @PathVariable Long id) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    Optional<Task> taskOptional = taskService.getTaskByIdAndUser(id, currentUser);
    if (taskOptional.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found or access denied");
    }

    taskService.deleteTask(id);
    return ResponseEntity.ok("Task deleted successfully");
  }

  @PutMapping("/{id}/complete")
  public ResponseEntity<?> completeTask(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
    if (currentUser == null || userRepository.findByUsername(currentUser.getUsername()).isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    Task existingTask = taskService
            .getTaskByIdAndUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

    existingTask.setIsCompleted(true);
    Task updatedTask = taskService.updateTask(existingTask);

    return ResponseEntity.ok(updatedTask);
  }
}
