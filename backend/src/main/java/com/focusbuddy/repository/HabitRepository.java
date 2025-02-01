package com.focusbuddy.repository;

import com.focusbuddy.model.Habit;
import com.focusbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findHabitByUser(User user);
    Optional<Habit> findHabitByIdAndUser(Long id, User user);
    void deleteAllByUser(User user);
}
