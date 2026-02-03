package com.example.xicombackend.service;

import com.example.xicombackend.entity.ServiceEntity;
import com.example.xicombackend.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class ServiceServiceImp implements ServiceService {

    private final ServiceRepository serviceRepository;

    @Override
    public ServiceEntity addService(ServiceEntity Services) {
        try {
            return serviceRepository.save(Services);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout de l'Service : Cette Service existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }


    @Override
    public void deleteServiceEntityById(Long id) {
        serviceRepository.deleteById(id);

    }

    @Override
    public ServiceEntity getServiceById(Long id) {
        return serviceRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

    @Override
    public List<ServiceEntity> getAllServices() {
        List<ServiceEntity> ServiceList = serviceRepository.findAll();
        Set<ServiceEntity> ServiceSet = new HashSet<>(ServiceList);

        return new ArrayList<>(ServiceSet);  // ✔ maintenant c’est une List
    }

    @Override
    public ServiceEntity updateService(Long id, ServiceEntity newData) {

        ServiceEntity existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        // 🔹 name
        if (newData.getTitle() != null) {
            existingService.setTitle(newData.getTitle());
        }

        if (newData.getSubTitle() != null) {
            existingService.setSubTitle(newData.getSubTitle());
        }

        // 🔹 description
        if (newData.getIcon() != null) {
            existingService.setIcon(newData.getIcon());
        }

        // 🔹 image
        if (newData.getImage() != null) {
            existingService.setImage(newData.getImage());
        }

        // 🔹 MISE À JOUR DES SECTIONS
        if (newData.getSections() != null && !newData.getSections().isEmpty()) {
            existingService.setSections(newData.getSections());
        }

        if (newData.getPriceSections() != null && !newData.getPriceSections().isEmpty()) {
            existingService.setPriceSections(newData.getPriceSections());
        }

        return serviceRepository.save(existingService);
    }
}
