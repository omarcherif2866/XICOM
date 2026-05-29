package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjetRepository extends JpaRepository<Projet,Long > {
    List<Projet> findByUserId(Long userId);
}
