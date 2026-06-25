package com.example.xicombackend.repository;

import com.example.xicombackend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;          // ✅ Spring, pas java.awt.print

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByServiceIdOrderBySentAtDesc(Long serviceId, Pageable pageable);

    @Query("SELECT DISTINCT c.serviceId FROM ChatMessage c WHERE c.senderUsername = :username")
    List<Long> findServiceIdsByUsername(String username);

    @Query("SELECT DISTINCT c.serviceId FROM ChatMessage c")
    List<Long> findAllServiceIds();

    @Modifying
    @Query("DELETE FROM ChatMessage c WHERE c.sentAt < :before")
    void deleteOlderThan(LocalDateTime before);
}