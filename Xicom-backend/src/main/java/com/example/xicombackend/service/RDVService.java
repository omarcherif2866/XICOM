package com.example.xicombackend.service;

import com.example.xicombackend.entity.RDV;

import java.util.List;

public interface RDVService {
    RDV addRDV(RDV RDVs);
    RDV updateRDV(Long id, String date, String heure, String lien_reunion);
    List<RDV> getAllRDV();
    List<RDV> getRDVByClient(String email);
}
