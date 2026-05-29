package com.example.xicombackend.service;

import com.example.xicombackend.dto.CommandeRequest;
import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.ServiceEntity;
import com.example.xicombackend.entity.StatusCommande;

import java.util.List;

public interface ServiceService {
    ServiceEntity addService(ServiceEntity Services);
    void deleteServiceEntityById(Long id);
    ServiceEntity getServiceById(Long id);
    public List<ServiceEntity> getAllServices();
    ServiceEntity updateService(Long id, ServiceEntity Service);

    Commande commanderService(CommandeRequest request);
    List<Commande> getCommandesByStatus(StatusCommande status);
    List<Commande> getCommandesByClient(Long userId);
    Commande updateStatus(Long id, StatusCommande status);

}
