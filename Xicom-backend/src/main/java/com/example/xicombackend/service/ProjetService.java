package com.example.xicombackend.service;

import com.example.xicombackend.entity.Client;

import java.util.List;

public interface ProjetService {
    Client create(Client projet);
    Client update(Long id, Client projet);
    void delete(Long id);
    Client getById(Long id);
    List<Client> getAll();
    long count();
    List<Client> getByUser(Long userId); // 👈 ajouter

}
