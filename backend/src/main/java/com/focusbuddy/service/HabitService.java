package com.focusbuddy.service;

import com.focusbuddy.model.Habit;
import com.focusbuddy.model.HabitType;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;

    public List<Habit> getAllHabitsByUser(User user) {
        return habitRepository.findHabitByUser(user);
    }

    public List<Habit> getGoodHabitsByUser(User user) {
        return getAllHabitsByUser(user).stream()
                .filter(habit -> habit.getType() == HabitType.GOOD)
                .toList();
    }


    public List<Habit> getBadHabitsByUser(User user) {
        return getAllHabitsByUser(user).stream()
                .filter(habit -> habit.getType() == HabitType.BAD)
                .toList();
    }

    public Habit createHabit(Habit habit, User currentUser) {
        habit.setUser(currentUser);
        return habitRepository.save(habit);
    }
}
