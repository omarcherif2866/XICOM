package com.example.xicombackend.service;

import com.example.xicombackend.entity.Partenaire;

import java.util.List;

public interface PartenaireService {

    Partenaire addPartenaire(Partenaire Partenaires);
    void deletePartenaireEntityById(Long id);
    Partenaire getPartenaireById(Long id);
    public List<Partenaire> getAllPartenaires();
    Partenaire updatePartenaire(Long id, Partenaire Partenaire);
    List<Partenaire> getPartenaireByServices(Long serviceId);


}
