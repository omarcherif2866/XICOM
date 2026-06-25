package com.example.xicombackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages", indexes = {
        @Index(name = "idx_service_id", columnList = "serviceId") // ✅ requêtes rapides
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long serviceId;
    private String senderUsername;
    private String senderRole;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime sentAt;
}