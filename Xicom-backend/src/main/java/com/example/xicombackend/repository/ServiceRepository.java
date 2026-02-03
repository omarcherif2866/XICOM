package com.example.xicombackend.repository;

import com.example.xicombackend.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity,Long > {
}
