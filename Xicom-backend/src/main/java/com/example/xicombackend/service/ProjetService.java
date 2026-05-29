package com.example.xicombackend.service;

import com.example.xicombackend.entity.Projet;

import java.util.List;

public interface ProjetService {
    Projet create(Projet projet);
    Projet update(Long id, Projet projet);
    void delete(Long id);
    Projet getById(Long id);
    List<Projet> getAll();
    long count();
    List<Projet> getByUser(Long userId); // 👈 ajouter

}
