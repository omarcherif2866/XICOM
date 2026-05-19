package com.example.xicombackend.repository;

import com.example.xicombackend.entity.RDV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RDVRepository extends JpaRepository<RDV,Long > {
    List<RDV> findByEmail(String email);
}
