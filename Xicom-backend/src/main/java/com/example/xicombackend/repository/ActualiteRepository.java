package com.example.xicombackend.repository;


import com.example.xicombackend.entity.Actualites;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActualiteRepository extends JpaRepository<Actualites,Long > {
}
