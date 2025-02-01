package com.focusbuddy.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.focusbuddy.dto.HabitDto;
import com.focusbuddy.model.Habit;
import com.focusbuddy.model.HabitType;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.UserRepository;
import com.focusbuddy.service.HabitService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class HabitControllerTest {

  @Mock private HabitService habitService;

  @Mock private UserRepository userRepository;

  @InjectMocks private HabitController habitController;

  private User testUser;
  private Habit testHabit;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setUsername("testuser");

    testHabit = new Habit();
    testHabit.setId(1L);
    testHabit.setTitle("Exercise");
    testHabit.setDescription("Workout every morning");
    testHabit.setType(HabitType.GOOD);
    testHabit.setUser(testUser);
  }

  @Test
  void shouldReturnAllHabits() {
    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(habitService.getAllHabitsByUser(testUser)).thenReturn(List.of(testHabit));

    ResponseEntity<List<Habit>> response = habitController.getAllHabits(testUser);

    assertEquals(1, response.getBody().size());
    assertEquals("Exercise", response.getBody().get(0).getTitle());
  }

  @Test
  void shouldReturnGoodHabits() {
    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(habitService.getGoodHabitsByUser(testUser)).thenReturn(List.of(testHabit));

    ResponseEntity<List<Habit>> response = habitController.getGoodHabits(testUser);

    assertEquals(1, response.getBody().size());
    assertEquals(HabitType.GOOD, response.getBody().get(0).getType());
  }

  @Test
  void shouldReturnBadHabits() {
    Habit badHabit = new Habit();
    badHabit.setId(2L);
    badHabit.setTitle("Smoking");
    badHabit.setDescription("Smoking cigarettes");
    badHabit.setType(HabitType.BAD);
    badHabit.setUser(testUser);

    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(habitService.getBadHabitsByUser(testUser)).thenReturn(List.of(badHabit));

    ResponseEntity<List<Habit>> response = habitController.getBadHabits(testUser);

    assertEquals(1, response.getBody().size());
    assertEquals(HabitType.BAD, response.getBody().get(0).getType());
  }

  @Test
  void shouldCreateHabit() {
    HabitDto habitDto = new HabitDto();
    habitDto.setTitle("Reading");
    habitDto.setDescription("Read books every day");
    habitDto.setType(HabitType.GOOD);

    Habit createdHabit = new Habit();
    createdHabit.setTitle(habitDto.getTitle());
    createdHabit.setDescription(habitDto.getDescription());
    createdHabit.setType(habitDto.getType());
    createdHabit.setUser(testUser);

    when(habitService.createHabit(any(Habit.class), eq(testUser))).thenReturn(createdHabit);

    ResponseEntity<Habit> response = habitController.createHabit(testUser, habitDto);

    assertEquals("Reading", response.getBody().getTitle());
    assertEquals(HabitType.GOOD, response.getBody().getType());
  }
}
