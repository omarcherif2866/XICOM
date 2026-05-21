package com.example.xicombackend.service;

import com.example.xicombackend.entity.Compagne;
import com.example.xicombackend.repository.CompagneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompagneServiceImp implements CompagneService {

    private final CompagneRepository compagneRepository;

    @Override
    public Compagne create(Compagne compagne) {
        return compagneRepository.save(compagne);
    }

    @Override
    public Compagne update(Long id, Compagne compagne) {
        Compagne existing = getById(id);
        compagne.setId(existing.getId());
        return compagneRepository.save(compagne);
    }

    @Override
    public void delete(Long id) {
        compagneRepository.deleteById(id);
    }

    @Override
    public Compagne getById(Long id) {
        return compagneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compagne introuvable : " + id));
    }

    @Override
    public List<Compagne> getAll() {
        return compagneRepository.findAll();
    }


    @Override
    public long count() {
        return compagneRepository.count();
    }
}
