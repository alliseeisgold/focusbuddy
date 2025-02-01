package com.focusbuddy.repository;

import com.focusbuddy.model.Task;
import com.focusbuddy.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findByUser(User user);

  Optional<Task> findByIdAndUser(Long id, User user);

  void deleteAllByUser(User user);
}
