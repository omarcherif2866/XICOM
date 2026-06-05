package com.example.xicombackend.service;

import com.cloudinary.Cloudinary;
import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.Facture;
import com.example.xicombackend.entity.StatusFacture;
import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.CommandeRepository;
import com.example.xicombackend.repository.FactureRepository;
import com.example.xicombackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class FactureServiceImpl implements FactureService {

    private final FactureRepository factureRepository;
    private final CommandeRepository commandeRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    @Override
    public Facture createFacture(Long commandeId, Integer userId,
                                 Double montant, MultipartFile fichier) throws IOException {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée : " + commandeId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé : " + userId));

        Facture facture = new Facture();
        facture.setMontant(montant);
        facture.setCommande(commande);
        facture.setUser(user);
        // reference générée par @PrePersist

        if (fichier != null && !fichier.isEmpty()) {
            String originalName = fichier.getOriginalFilename();
            String sanitized = (originalName != null)
                    ? originalName.trim().replaceAll("\\s+", "_")
                    : "fichier_" + System.currentTimeMillis();

            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "raw");
            options.put("access_mode", "public");
            options.put("use_filename", true);
            options.put("unique_filename", false);
            // ✅ public_id avec le nom complet incluant l'extension
            options.put("public_id", "xicom/factures/" + sanitized);

            Map result = cloudinary.uploader().upload(fichier.getBytes(), options);
            facture.setFichierUrl((String) result.get("secure_url"));
        }

        return factureRepository.save(facture);
    }

    @Override
    public Facture getById(Long id) {
        return factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée : " + id));
    }

    @Override
    public List<Facture> getAll() {
        return factureRepository.findAll();
    }

    @Override
    public List<Facture> getByUserId(Long userId) {
        return factureRepository.findByUserId(userId);
    }

    @Override
    public List<Facture> getByCommandeId(Long commandeId) {
        return factureRepository.findByCommandeId(commandeId);
    }

    @Override
    public Facture updateStatus(Long id, StatusFacture status) {
        Facture facture = getById(id);
        facture.setStatus(status);
        return factureRepository.save(facture);
    }

    @Override
    public void delete(Long id) {
        factureRepository.deleteById(id);
    }
}