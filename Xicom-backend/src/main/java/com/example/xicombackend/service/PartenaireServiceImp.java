package com.example.xicombackend.service;

import com.example.xicombackend.entity.Partenaire;
import com.example.xicombackend.repository.PartenaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class PartenaireServiceImp implements PartenaireService {

    private final PartenaireRepository partenaireRepository;

    @Override
    public Partenaire addPartenaire(Partenaire Partenaires) {
        try {
            return partenaireRepository.save(Partenaires);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout du Partenaires : Cette Partenaires existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @Override
    public void deletePartenaireEntityById(Long id) {
        partenaireRepository.deleteById(id);
    }

    @Override
    public Partenaire getPartenaireById(Long id) {
        return partenaireRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("partenaire not found"));
    }

    @Override
    public List<Partenaire> getAllPartenaires() {
        List<Partenaire> PartenairesList = partenaireRepository.findAll();
        Set<Partenaire> PartenairesSet = new HashSet<>(PartenairesList);

        return new ArrayList<>(PartenairesSet);  // ✔ maintenant c’est une List
    }

    @Override
    public Partenaire updatePartenaire(Long id, Partenaire partenaireData) {

        Partenaire partenaire = partenaireRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partenaire not found with id: " + id));

        // Update simple fields
        if (partenaireData.getName() != null) {
            partenaire.setName(partenaireData.getName());
        }
        if (partenaireData.getDescription() != null) {
            partenaire.setDescription(partenaireData.getDescription());
        }
        if (partenaireData.getImage() != null) {
            partenaire.setImage(partenaireData.getImage());
        }

        // Update ManyToMany (formations)
        if (partenaireData.getServices() != null) {
            partenaire.getServices().clear();   // on vide les anciennes associations
            partenaire.getServices().addAll(partenaireData.getServices());
        }

        return partenaireRepository.save(partenaire);
    }

    @Override
    public List<Partenaire> getPartenaireByServices(Long sousFormationId) {
        return partenaireRepository.findByServicesId(sousFormationId);
    }


}

