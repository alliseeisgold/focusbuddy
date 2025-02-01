package com.focusbuddy.service;

import com.focusbuddy.model.Task;
import com.focusbuddy.model.User;
import com.focusbuddy.repository.TaskRepository;
import com.focusbuddy.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public List<Task> getAllTasksForUser(User user) {
        return taskRepository.findByUser(user);
    }

    public List<Task> getCurrentTasksForUser(User user) {
        return getAllTasksForUser(user).stream()
                .filter(Task::getIsCurrent)
                .toList();
    }

    public List<Task> getPlannedTasksForUser(User user) {
        return getAllTasksForUser(user).stream()
                .filter(task -> !task.getIsCurrent())
                .toList();
    }

    public List<Task> getTomorrowDeadlineTasksForUser(User user) {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return getPlannedTasksForUser(user).stream()
                .filter(task -> tomorrow.equals(task.getDueDate()))
                .toList();
    }

    public List<Task> getCompletedTasksForUser(User user) {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        return getPlannedTasksForUser(user).stream()
                .filter(Task::getIsCompleted)
                .toList();
    }


    @Transactional
    public Task createTask(Task task, User user) {
        task.setUser(user);
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Optional<Task> getTaskByIdAndUser(Long id, User user) {
        return taskRepository.findByIdAndUser(id, user);
    }
}
