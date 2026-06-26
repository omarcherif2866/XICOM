package com.example.xicombackend.service;

import com.example.xicombackend.entity.UnreadCount;
import com.example.xicombackend.repository.UnreadCountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnreadCountService {

    private final UnreadCountRepository repo;

    public void increment(String username, Long serviceId) {
        UnreadCount u = repo.findByUsernameAndServiceId(username, serviceId)
                .orElse(new UnreadCount(null, username, serviceId, 0));
        u.setCount(u.getCount() + 1);
        repo.save(u);
    }

    public void reset(String username, Long serviceId) {
        repo.findByUsernameAndServiceId(username, serviceId)
                .ifPresent(repo::delete); // ✅ supprime la ligne au lieu de mettre 0
    }

    public List<UnreadCount> getAll(String username) {
        return repo.findByUsername(username);
    }
}
