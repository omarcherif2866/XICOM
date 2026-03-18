package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Partenaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartenaireRepository extends JpaRepository<Partenaire,Long > {
    List<Partenaire> findByServicesId(Long serviceId);

}
