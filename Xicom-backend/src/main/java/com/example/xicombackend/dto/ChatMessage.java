package com.example.xicombackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChatMessage {
    private String content;
    private String senderUsername;
    private String senderRole;
    private Long serviceId;
    private LocalDateTime sentAt;
}