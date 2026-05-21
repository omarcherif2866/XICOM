package com.example.xicombackend.service;

import com.example.xicombackend.entity.Compagne;

import java.util.List;

public interface CompagneService {
    Compagne create(Compagne compagne);
    Compagne update(Long id, Compagne compagne);
    void delete(Long id);
    Compagne getById(Long id);
    List<Compagne> getAll();
    long count();
}
