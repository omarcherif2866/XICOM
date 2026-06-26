package com.example.xicombackend.controllers;

import com.example.xicombackend.dto.CommandeRequest;
import com.example.xicombackend.entity.*;
import com.example.xicombackend.repository.CommandeRepository;
import com.example.xicombackend.repository.PartenaireRepository;
import com.example.xicombackend.repository.ServiceRepository;
import com.example.xicombackend.service.CloudinaryService;
import com.example.xicombackend.service.ServiceService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/service")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;
    private final CloudinaryService cloudinaryService;
    private final ServiceRepository serviceRepository ;
    private final PartenaireRepository partenaireRepository;
    private final CommandeRepository commandeRepository;


    @PostMapping
    public ResponseEntity<?> addServiceEntity(
            @RequestParam("title") String title,
            @RequestParam("subtitle") String subtitle,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("sections") String sectionsJson,
            @RequestParam("priceSections") String priceSectionsJson,
            @RequestParam(value = "icon", required = false) MultipartFile icon,
            @RequestParam(value = "partenairesIds", required = false) List<Long> partenairesIds,
            @RequestParam(value = "detailIcons", required = false) MultipartFile[] detailIcons
    ) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            System.out.println("🔍 sectionsJson reçu: " + sectionsJson);
            System.out.println("🔍 Nombre de detailIcons reçus: " + (detailIcons != null ? detailIcons.length : 0));

            // Parse sections
            List<ServiceSection> sections = mapper.readValue(
                    sectionsJson,
                    new TypeReference<List<ServiceSection>>() {}
            );

            // Parse priceSections
            List<PriceSection> priceSections = mapper.readValue(
                    priceSectionsJson,
                    new TypeReference<List<PriceSection>>() {}
            );

            // ✅ Upload des icônes — même logique que le PUT
            if (detailIcons != null && detailIcons.length > 0) {
                int iconIndex = 0;
                for (ServiceSection section : sections) {
                    if (section.getDetails() != null) {
                        for (DetailObject detail : section.getDetails()) {
                            if ("".equals(detail.getIcon())) {
                                // ✅ Seulement "" = nouveau fichier
                                if (iconIndex < detailIcons.length) {
                                    MultipartFile iconFile = detailIcons[iconIndex];
                                    if (iconFile != null && !iconFile.isEmpty()) {
                                        String iconUrl = cloudinaryService.uploadIcon(iconFile, "xicom/icon");
                                        detail.setIcon(iconUrl);
                                        System.out.println("✅ Icône uploadée: " + iconUrl);
                                    }
                                    iconIndex++;
                                }
                            } else if (detail.getIcon() != null && !detail.getIcon().isEmpty()) {
                                System.out.println("⏭️ Icône existante conservée: " + detail.getIcon());
                            }
                            // null → ignoré, iconIndex ne bouge pas
                        }
                    }
                }
            }
            ServiceEntity serviceEntity = new ServiceEntity();
            serviceEntity.setTitle(title);
            serviceEntity.setSubTitle(subtitle);
            serviceEntity.setSections(sections);
            serviceEntity.setPriceSections(priceSections);

            // Upload image principale
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image, "xicom/service");
                serviceEntity.setImage(imageUrl);
                System.out.println("✅ Image uploadée: " + imageUrl);
            }

            // Upload icône principale
            if (icon != null && !icon.isEmpty()) {
                String iconUrl = cloudinaryService.uploadIcon(icon, "xicom/icon");
                serviceEntity.setIcon(iconUrl);
                System.out.println("✅ Icône principale uploadée: " + iconUrl);
            }

            if (partenairesIds != null && !partenairesIds.isEmpty()) {
                serviceEntity.setPartenaires(
                        partenaireRepository.findAllById(partenairesIds)
                );
            }

            System.out.println("🔍 Sections avant save:");
            for (ServiceSection s : sections) {
                if (s.getDetails() != null) {
                    for (DetailObject d : s.getDetails()) {
                        System.out.println("  - " + d.getTitle() + " → " + d.getIcon());
                    }
                }
            }

            ServiceEntity saved = serviceRepository.save(serviceEntity);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            System.err.println("❌ ERREUR BACKEND: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("{id}")
    public ServiceEntity getServiceEntityById(@PathVariable Long id) {
        return serviceService.getServiceById(id);
    }

    @DeleteMapping("{id}")
    public void deleteServiceEntity(@PathVariable Long id) {
        serviceService.deleteServiceEntityById(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ServiceEntity>> getAllServiceEntitys() {
        List<ServiceEntity> ServiceEntitys = serviceService.getAllServices();
        return ResponseEntity.ok(ServiceEntitys);
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateServiceEntity(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("subtitle") String subtitle,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("sections") String sectionsJson,
            @RequestParam("priceSections") String priceSectionsJson,
            @RequestParam(value = "icon", required = false) MultipartFile icon,
            @RequestParam(value = "partenairesIds", required = false) List<Long> partenairesIds,
            @RequestParam(value = "detailIcons", required = false) MultipartFile[] detailIcons
    ) {
        try {
            System.out.println("🔍 sectionsJson reçu: " + sectionsJson);
            System.out.println("🔍 Nombre de detailIcons reçus: " + (detailIcons != null ? detailIcons.length : 0));

            if (detailIcons != null) {
                for (int i = 0; i < detailIcons.length; i++) {
                    System.out.println("🔍 detailIcons[" + i + "]: " +
                            (detailIcons[i] != null ? detailIcons[i].getOriginalFilename() : "null"));
                }
            }

            ServiceEntity existing = serviceService.getServiceById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Service non trouvé");
            }

            if (title != null) existing.setTitle(title);
            if (subtitle != null) existing.setSubTitle(subtitle);

            // ✅ Mise à jour des sections
            if (sectionsJson != null && !sectionsJson.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                List<ServiceSection> sections = mapper.readValue(
                        sectionsJson,
                        new TypeReference<List<ServiceSection>>() {}
                );

                System.out.println("🔍 Nombre de sections: " + sections.size());

                // ✅ Upload des nouvelles icônes (seulement pour icon == "")
                if (detailIcons != null && detailIcons.length > 0) {
                    int iconIndex = 0;
                    for (ServiceSection section : sections) {
                        if (section.getDetails() != null) {
                            for (DetailObject detail : section.getDetails()) {

                                // ✅ Seulement "" = nouveau fichier à uploader
                                // null = pas d'icône, on ne touche pas à iconIndex
                                if ("".equals(detail.getIcon())) {
                                    if (iconIndex < detailIcons.length) {
                                        MultipartFile iconFile = detailIcons[iconIndex];
                                        if (iconFile != null && !iconFile.isEmpty()) {
                                            String iconUrl = cloudinaryService.uploadIcon(iconFile, "xicom/icon");
                                            detail.setIcon(iconUrl);
                                            System.out.println("✅ Icône uploadée: " + iconUrl);
                                        }
                                        iconIndex++;
                                    }
                                } else if (detail.getIcon() != null && !detail.getIcon().isEmpty()) {
                                    System.out.println("⏭️ Icône existante conservée: " + detail.getIcon());
                                }
                                // null → on ignore, pas d'incrémentation
                            }
                        }
                    }
                }
                existing.setSections(new ArrayList<>(sections));

                System.out.println("🔍 Sections après modification:");
                for (ServiceSection s : existing.getSections()) {
                    if (s.getDetails() != null) {
                        for (DetailObject d : s.getDetails()) {
                            System.out.println("  - " + d.getTitle() + " → " + d.getIcon());
                        }
                    }
                }
            }

            // ✅ Mise à jour des priceSections
// ✅ Mise à jour des priceSections
            if (priceSectionsJson != null && !priceSectionsJson.isEmpty()) {
                ObjectMapper priceMapper = new ObjectMapper();
                List<PriceSection> priceSections = priceMapper.readValue(
                        priceSectionsJson,
                        new TypeReference<List<PriceSection>>() {}
                );

                // ✅ AJOUTE ICI
                for (PriceSection ps : priceSections) {
                    System.out.println("💰 pricePer reçu: " + ps.getPricePer());
                }

                existing.setPriceSections(priceSections);
            }

            // ✅ Upload image principale
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image, "xicom/service");
                existing.setImage(imageUrl);
                System.out.println("✅ Image uploadée: " + imageUrl);
            }

            // ✅ Upload icône principale
            if (icon != null && !icon.isEmpty()) {
                String iconUrl = cloudinaryService.uploadIcon(icon, "xicom/icon");
                existing.setIcon(iconUrl);
                System.out.println("✅ Icône principale uploadée: " + iconUrl);
            }

            // ✅ Mise à jour des partenaires
            if (partenairesIds != null && !partenairesIds.isEmpty()) {
                List<Partenaire> partenaires = partenaireRepository.findAllById(partenairesIds);
                existing.setPartenaires(partenaires);
                System.out.println("✅ Partenaires mis à jour: " + partenaires.size());
            }

            // ✅ Sauvegarder directement sans repasser par updateService
            // pour éviter que Hibernate re-fetch l'entité et écrase les URLs Cloudinary
            ServiceEntity saved = serviceRepository.save(existing);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            System.err.println("❌ ERREUR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }

    @PostMapping("/commander")
    public ResponseEntity<Commande> commander(@RequestBody CommandeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceService.commanderService(request));
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<Commande>> getCommandesByStatus(
            @RequestParam("status") StatusCommande status) {
        return ResponseEntity.ok(serviceService.getCommandesByStatus(status));
    }

    @GetMapping("/by-client/{userId}")
    public ResponseEntity<List<Commande>> getCommandesByClient(@PathVariable Long userId) {
        return ResponseEntity.ok(serviceService.getCommandesByClient(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Commande> updateStatus(
            @PathVariable Long id,
            @RequestParam StatusCommande status) {
        return ResponseEntity.ok(serviceService.updateStatus(id, status));
    }

    @PutMapping("/{id}/payer")
    public ResponseEntity<Commande> payer(@PathVariable Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        commande.setPaymentStatus(PayementStatus.PAYEE);
        return ResponseEntity.ok(commandeRepository.save(commande));
    }

}
