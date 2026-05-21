package com.example.xicombackend.service;

import com.example.xicombackend.entity.Projet;
import com.example.xicombackend.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetServiceImp implements ProjetService {

    private final ProjetRepository projetRepository;

    @Override
    public Projet create(Projet projet) {
        return projetRepository.save(projet);
    }

    @Override
    public Projet update(Long id, Projet projet) {
        Projet existing = getById(id);
        projet.setId(existing.getId());
        return projetRepository.save(projet);
    }

    @Override
    public void delete(Long id) {
        projetRepository.deleteById(id);
    }

    @Override
    public Projet getById(Long id) {
        return projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet introuvable : " + id));
    }

    @Override
    public List<Projet> getAll() {
        return projetRepository.findAll();
    }

    @Override
    public long count() {
        return projetRepository.count();
    }
}
