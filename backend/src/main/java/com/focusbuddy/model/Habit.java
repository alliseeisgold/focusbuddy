package com.focusbuddy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "habits")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private HabitType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}