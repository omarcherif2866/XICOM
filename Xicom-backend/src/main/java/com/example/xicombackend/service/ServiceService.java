package com.example.xicombackend.service;

import com.example.xicombackend.entity.ServiceEntity;

import java.util.List;

public interface ServiceService {
    ServiceEntity addService(ServiceEntity Services);
    void deleteServiceEntityById(Long id);
    ServiceEntity getServiceById(Long id);
    public List<ServiceEntity> getAllServices();
    ServiceEntity updateService(Long id, ServiceEntity Service);
}
