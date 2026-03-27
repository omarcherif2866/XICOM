package com.example.xicombackend.service;

import com.example.xicombackend.entity.Actualites;

import java.util.List;

public interface ActualiteService {

    Actualites addActualites(Actualites Actualitess);
    void deleteActualitesEntityById(Long id);
    Actualites getActualitesById(Long id);
    public List<Actualites> getAllActualitess();
    Actualites updateActualites(Long id, Actualites Actualites);



}
