package com.example.xicombackend.service;

import com.cloudinary.Cloudinary;
import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.Livrable;
import com.example.xicombackend.repository.CommandeRepository;
import com.example.xicombackend.repository.LivrableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LivrableServiceImpl implements LivrableService {

    private final LivrableRepository livrableRepository;
    private final Cloudinary cloudinary;

    @Override
    public Livrable createLivrable(Livrable livrable) {
        return livrableRepository.save(livrable);
    }

    @Override
    public Livrable getLivrableById(Long id) {
        return livrableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livrable non trouvé avec l'id : " + id));
    }

    @Override
    public List<Livrable> getAllLivrables() {
        return livrableRepository.findAll();
    }

    @Override
    public Livrable updateLivrable(Long id, Livrable updated) {
        Livrable existing = getLivrableById(id);
        existing.setTitre(updated.getTitre());
        existing.setDescription(updated.getDescription());
        existing.setFichierUrl(updated.getFichierUrl());
        existing.setStatus(updated.getStatus());
        existing.setDateLivraison(updated.getDateLivraison());
        return livrableRepository.save(existing);
    }

    @Override
    public void deleteLivrable(Long id) {
        livrableRepository.deleteById(id);
    }

    @Override
    public Livrable getLivrableByCommande(Long commandeId) {
        return livrableRepository.findByCommandeId(commandeId)
                .orElseThrow(() -> new RuntimeException("Aucun livrable trouvé pour la commande : " + commandeId));
    }

    @Override
    public List<Livrable> getLivrablesByUserId(Long userId) {
        return livrableRepository.findByUserId(userId);
    }

    @Override
    public List<Commande> getCommandesByLivrable(Long livrableId) {
        Livrable livrable = getLivrableById(livrableId);
        return livrable.getCommandes();
    }


    @Override
    public Livrable addFichiers(Long livrableId, List<MultipartFile> files) throws IOException {
        Livrable livrable = livrableRepository.findById(livrableId)
                .orElseThrow(() -> new RuntimeException("Livrable non trouvé : " + livrableId));
        if (livrable.getFichierUrl() == null) livrable.setFichierUrl(new ArrayList<>());
        if (files != null) {
            for (MultipartFile file : files) {
                String contentType = file.getContentType();
                String folder = (contentType != null && contentType.startsWith("image/"))
                        ? "xicom/livrable/images" : "xicom/livrable/fichiers";
                livrable.getFichierUrl().add(uploadFile(file, folder));
            }
        }
        return livrableRepository.save(livrable);
    }

    @Override
    public Livrable removeFichier(Long livrableId, String url) {
        Livrable livrable = livrableRepository.findById(livrableId)
                .orElseThrow(() -> new RuntimeException("Livrable non trouvé : " + livrableId));
        if (livrable.getFichierUrl() != null) livrable.getFichierUrl().remove(url);
        return livrableRepository.save(livrable);
    }

    @Override
    public List<String> getFichiers(Long livrableId) {
        Livrable livrable = livrableRepository.findById(livrableId)
                .orElseThrow(() -> new RuntimeException("Livrable non trouvé : " + livrableId));
        return livrable.getFichierUrl() != null ? livrable.getFichierUrl() : new ArrayList<>();
    }

    private String uploadFile(MultipartFile file, String folder) throws IOException {
        Map<String, Object> options = new HashMap<>();
        options.put("folder", folder);

        String originalName = file.getOriginalFilename();
        String contentType = file.getContentType();

        if (contentType != null && !contentType.startsWith("image/")) {
            options.put("resource_type", "raw");

            if (originalName != null) {
                // ✅ Sanitize le nom et l'inclure dans public_id avec extension
                String sanitized = originalName.trim().replaceAll("\\s+", "_");
                options.put("public_id", folder + "/" + sanitized);
                options.put("use_filename", true);
                options.put("unique_filename", false);
            }
        }

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        return (String) uploadResult.get("secure_url");
    }
}