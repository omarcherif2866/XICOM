package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.ChatMessage;
import com.example.xicombackend.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    // ✅ WebSocket : reçoit, persiste, broadcast
    @MessageMapping("/chat.send/{serviceId}")
    public void sendMessage(@DestinationVariable Long serviceId,
                            @Payload ChatMessage message) {
        message.setServiceId(serviceId);
        message.setSentAt(LocalDateTime.now());
        chatMessageService.save(message);
        messagingTemplate.convertAndSend("/topic/chat/" + serviceId, message);
    }

    // ✅ Historique paginé (50 derniers)
    @GetMapping("/chat/history/{serviceId}")
    @ResponseBody
    public List<ChatMessage> getHistory(@PathVariable Long serviceId) {
        return chatMessageService.getHistory(serviceId);
    }

    // ✅ Liste des discussions selon le rôle
    @GetMapping("/chat/discussions")
    @ResponseBody
    public List<Long> getDiscussions(@RequestParam String username,
                                     @RequestParam String role) {
        if ("Admin".equals(role)) {
            return chatMessageService.getAllDiscussions();
        }
        return chatMessageService.getDiscussionsForClient(username);
    }
}