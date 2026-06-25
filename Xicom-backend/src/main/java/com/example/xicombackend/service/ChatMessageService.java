package com.example.xicombackend.service;

import com.example.xicombackend.entity.ChatMessage;
import com.example.xicombackend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;       // ✅ Spring, pas java.awt.print
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository repo;

    public ChatMessage save(ChatMessage msg) {
        return repo.save(msg);
    }

    // ✅ 50 derniers messages seulement
    public List<ChatMessage> getHistory(Long serviceId) {
        Pageable pageable = PageRequest.of(0, 50);
        Page<ChatMessage> page = repo.findByServiceIdOrderBySentAtDesc(serviceId, pageable);
        List<ChatMessage> messages = new ArrayList<>(page.getContent()); // ✅ copie modifiable
        Collections.reverse(messages);
        return messages;
    }

    public List<Long> getDiscussionsForClient(String username) {
        return repo.findServiceIdsByUsername(username);
    }

    public List<Long> getAllDiscussions() {
        return repo.findAllServiceIds();
    }
}
