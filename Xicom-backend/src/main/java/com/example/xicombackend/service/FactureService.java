package com.example.xicombackend.service;

import com.example.xicombackend.entity.Facture;
import com.example.xicombackend.entity.StatusFacture;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FactureService {
    Facture createFacture(Long commandeId, Integer userId,
                          Double montant, MultipartFile fichier) throws IOException;
    Facture getById(Long id);
    List<Facture> getAll();
    List<Facture> getByUserId(Long userId);
    List<Facture> getByCommandeId(Long commandeId);
    Facture updateStatus(Long id, StatusFacture status);
    void delete(Long id);
}
