package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjetRepository extends JpaRepository<Client,Long > {
    List<Client> findByUserId(Long userId);
}
