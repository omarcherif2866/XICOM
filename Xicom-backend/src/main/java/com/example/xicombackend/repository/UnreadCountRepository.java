package com.example.xicombackend.repository;

import com.example.xicombackend.entity.UnreadCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UnreadCountRepository extends JpaRepository<UnreadCount, Long> {
    Optional<UnreadCount> findByUsernameAndServiceId(String username, Long serviceId);
    List<UnreadCount> findByUsername(String username);
}
