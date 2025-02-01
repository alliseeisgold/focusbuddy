package com.focusbuddy.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.focusbuddy.dto.TaskDto;
import com.focusbuddy.model.Task;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.UserRepository;
import com.focusbuddy.service.TaskService;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

  @Mock private TaskService taskService;

  @Mock private UserRepository userRepository;

  @InjectMocks private TaskController taskController;

  private User testUser;
  private Task testTask;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setUsername("testuser");

    testTask = new Task();
    testTask.setId(1L);
    testTask.setTitle("Test Task");
    testTask.setDescription("Test Description");
    testTask.setDueDate(LocalDate.now());
    testTask.setUser(testUser);
  }

  @Test
  void shouldReturnAllTasks() {
    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(taskService.getAllTasksForUser(testUser)).thenReturn(List.of(testTask));

    ResponseEntity<List<Task>> response = taskController.getTasks(testUser);

    assertEquals(1, response.getBody().size());
    assertEquals("Test Task", response.getBody().get(0).getTitle());
  }

  @Test
  void shouldCreateCurrentTask() {
    TaskDto taskDto = new TaskDto();
    taskDto.setTitle("Test Task");
    taskDto.setDescription("Test Description");
    Task createdTask = new Task();
    createdTask.setTitle("New Task");
    createdTask.setDescription("Description");
    createdTask.setUser(testUser);
    createdTask.setIsCurrent(true);

    when(taskService.createTask(any(Task.class), eq(testUser))).thenReturn(createdTask);

    ResponseEntity<Task> response = taskController.createTodayTask(testUser, taskDto);

    assertEquals("New Task", Objects.requireNonNull(response.getBody()).getTitle());
    assertTrue(response.getBody().getIsCurrent());
  }

  @Test
  void shouldCreatePlannedTask() {
    TaskDto taskDto =
        new TaskDto("Planned Task", "Future Task", LocalDate.now().plusDays(2), false, false);
    Task plannedTask = new Task();
    plannedTask.setTitle("Planned Task");
    plannedTask.setDescription("Future Task");
    plannedTask.setDueDate(taskDto.getDueDate());
    plannedTask.setUser(testUser);
    plannedTask.setIsCurrent(false);

    when(taskService.createTask(any(Task.class), eq(testUser))).thenReturn(plannedTask);

    ResponseEntity<Task> response = taskController.createPlannedTask(testUser, taskDto);

    assertEquals("Planned Task", response.getBody().getTitle());
    assertFalse(response.getBody().getIsCurrent());
  }

  @Test
  void shouldThrowExceptionForPastPlannedTask() {
    TaskDto taskDto =
        new TaskDto("Old Task", "Past Task", LocalDate.now().minusDays(1), false, false);

    assertThrows(
        IllegalArgumentException.class, () -> taskController.createPlannedTask(testUser, taskDto));
  }

  @Test
  void shouldReturnCurrentTasks() {
    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(taskService.getCurrentTasksForUser(testUser)).thenReturn(List.of(testTask));

    ResponseEntity<List<Task>> response = taskController.getCurrentTasks(testUser);

    assertEquals(1, response.getBody().size());
    assertEquals("Test Task", response.getBody().get(0).getTitle());
  }

  @Test
  void shouldUpdateTask() {
    TaskDto updateDto =
        new TaskDto("Updated Task", "Updated Desc", LocalDate.now().plusDays(1), true, false);
    testTask.setIsCompleted(true);
    testTask.setIsCurrent(false); // ✅ Добавили инициализацию

    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(taskService.getTaskByIdAndUser(1L, testUser)).thenReturn(Optional.of(testTask));
    when(taskService.updateTask(any(Task.class))).thenReturn(testTask);

    ResponseEntity<?> response = taskController.updateTask(testUser, 1L, updateDto);

    assertEquals("Updated Task", ((Task) response.getBody()).getTitle());
    assertTrue(((Task) response.getBody()).getIsCompleted());
  }

  @Test
  void shouldDeleteTask() {
    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(taskService.getTaskByIdAndUser(1L, testUser)).thenReturn(Optional.of(testTask));

    ResponseEntity<?> response = taskController.deleteTask(testUser, 1L);

    verify(taskService, times(1)).deleteTask(1L);
    assertEquals("Task deleted successfully", response.getBody());
  }
}
