package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetRepository extends JpaRepository<Projet,Long > {
}
