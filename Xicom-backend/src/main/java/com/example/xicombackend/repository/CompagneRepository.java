package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Compagne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompagneRepository extends JpaRepository<Compagne,Long > {
}
