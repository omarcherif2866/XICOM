package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.StatusCommande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByStatus(StatusCommande status);

    List<Commande> findByUserId(Long userId);
}
