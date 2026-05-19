package com.example.xicombackend.service;

import com.example.xicombackend.entity.Abonnee;

import java.util.List;

public interface AbonneeService {
    Abonnee addAbonne(Abonnee Abonnees);
    long countAbonnes();
    List<Abonnee> getAllAbonnes();

}
