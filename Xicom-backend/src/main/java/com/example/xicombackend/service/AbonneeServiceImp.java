package com.example.xicombackend.service;


import com.example.xicombackend.entity.Abonnee;
import com.example.xicombackend.repository.AbonneeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class AbonneeServiceImp implements AbonneeService {

    private final AbonneeRepository abonneesRepository;


    @Override
    public Abonnee addAbonne(Abonnee Abonneess) {
        try {
            return abonneesRepository.save(Abonneess);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout de l'abonnée : Cette abonnée existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @Override
    public long countAbonnes() {
        return abonneesRepository.count();
    }

    @Override
    public List<Abonnee> getAllAbonnes() {
        return abonneesRepository.findAll();
    }
}
