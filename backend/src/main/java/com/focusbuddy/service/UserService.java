package com.focusbuddy.service;

import com.focusbuddy.model.User;
import com.focusbuddy.repository.HabitRepository;
import com.focusbuddy.repository.RefreshTokenRepository;
import com.focusbuddy.repository.TaskRepository;
import com.focusbuddy.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TaskRepository taskRepository;
    private final HabitRepository habitRepository;

    public User updateUser(User currentUser, User updatedUser) {
        currentUser.setUsername(updatedUser.getUsername());
        currentUser.setTelegramId(updatedUser.getTelegramId());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        return userRepository.save(currentUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(User user) {
        taskRepository.deleteAllByUser(user);
        habitRepository.deleteAllByUser(user);
        refreshTokenRepository.deleteByUser(user);
        userRepository.delete(user);
    }
}
