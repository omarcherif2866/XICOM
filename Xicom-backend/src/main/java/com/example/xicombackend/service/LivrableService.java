package com.example.xicombackend.service;

import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.Livrable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface LivrableService {
    Livrable createLivrable(Livrable livrable);
    Livrable getLivrableById(Long id);
    List<Livrable> getAllLivrables();
    Livrable updateLivrable(Long id, Livrable livrable);
    void deleteLivrable(Long id);
    List<Commande> getCommandesByLivrable(Long livrableId);
    Livrable getLivrableByCommande(Long commandeId);
    List<Livrable> getLivrablesByUserId(Long userId);

    Livrable addFichiers(Long livrableId, List<MultipartFile> files) throws IOException;
    Livrable removeFichier(Long livrableId, String url);
    List<String> getFichiers(Long livrableId);
}