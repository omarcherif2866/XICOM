package com.example.xicombackend.service;

import com.example.xicombackend.entity.Actualites;
import com.example.xicombackend.repository.ActualiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class ActualiteServiceImp implements ActualiteService {

    private final ActualiteRepository actualitesRepository;


    @Override
    public Actualites addActualites(Actualites Actualitess) {
        try {
            return actualitesRepository.save(Actualitess);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout de l'activité : Cette activité existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @Override
    public void deleteActualitesEntityById(Long id) {
        actualitesRepository.deleteById(id);

    }

    @Override
    public Actualites getActualitesById(Long id) {
        return actualitesRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Actualites not found"));
    }

    @Override
    public List<Actualites> getAllActualitess() {
        List<Actualites> ActualitessList = actualitesRepository.findAll();
        Set<Actualites> ActualitessSet = new HashSet<>(ActualitessList);

        return new ArrayList<>(ActualitessSet);  // ✔ maintenant c’est une List
    }

    @Override
    public Actualites updateActualites(Long id, Actualites Actualites) {
        try {
            Actualites existingActualites = actualitesRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Actualites not found"));

            if (Actualites.getDescription() != null) {
                existingActualites.setDescription(Actualites.getDescription());
            }
            if (Actualites.getTitle() != null) {
                existingActualites.setTitle(Actualites.getTitle());
            }



            Actualites updatedActualites = actualitesRepository.save(existingActualites);

            return updatedActualites;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Actualites not found with ID: " + id);
        }
    }
}
