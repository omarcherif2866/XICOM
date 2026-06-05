package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Facture;
import com.example.xicombackend.entity.StatusFacture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByUserId(Long userId);
    List<Facture> findByCommandeId(Long commandeId);
    List<Facture> findByStatus(StatusFacture status);
}
