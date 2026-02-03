package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.DetailObject;
import com.example.xicombackend.entity.PriceSection;
import com.example.xicombackend.entity.ServiceEntity;
import com.example.xicombackend.entity.ServiceSection;
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


    @PostMapping
    public ResponseEntity<?> addServiceEntity(
            @RequestParam("title") String title,
            @RequestParam("subtitle") String subtitle,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("sections") String sectionsJson,
            @RequestParam("priceSections") String priceSectionsJson,
            @RequestParam(value = "icon", required = false) MultipartFile icon,
            @RequestParam(value = "detailIcons", required = false) MultipartFile[] detailIcons
    ) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();

        try {
            // Parse sections
            List<ServiceSection> sections = mapper.readValue(
                    sectionsJson,
                    new TypeReference<List<ServiceSection>>(){}
            );

            // Parse priceSections
            List<PriceSection> priceSections = mapper.readValue(
                    priceSectionsJson,
                    new TypeReference<List<PriceSection>>(){}
            );

            // Upload des icônes de DetailObject
            if (detailIcons != null && detailIcons.length > 0) {
                int iconIndex = 0;
                for (ServiceSection section : sections) {
                    if (section.getDetails() != null) {
                        for (DetailObject detail : section.getDetails()) {
                            if (iconIndex < detailIcons.length &&
                                    detailIcons[iconIndex] != null &&
                                    !detailIcons[iconIndex].isEmpty()) {
                                String iconUrl = cloudinaryService.uploadIcon(
                                        detailIcons[iconIndex],
                                        "xicom/icon"
                                );
                                detail.setIcon(iconUrl);
                                System.out.println("✅ Icône detail uploadée: " + iconUrl);
                                iconIndex++;
                            }
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

            // Upload icon principal
            if (icon != null && !icon.isEmpty()) {
                String iconUrl = cloudinaryService.uploadIcon(icon, "xicom/icon");
                serviceEntity.setIcon(iconUrl);
                System.out.println("✅ Icône uploadée: " + iconUrl);
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
            @RequestParam(value = "detailIcons", required = false) MultipartFile[] detailIcons
    ) {

        try {
            // DÉBOGAGE: Vérifier ce qui arrive
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
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Service non trouvé");
            }

            if (title != null) existing.setTitle(title);
            if (subtitle != null) existing.setSubTitle(subtitle);

            // Mise à jour des sections
            // Mise à jour des sections
            if (sectionsJson != null && !sectionsJson.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                List<ServiceSection> sections = mapper.readValue(
                        sectionsJson,
                        new TypeReference<List<ServiceSection>>() {}
                );

                System.out.println("🔍 Nombre de sections: " + sections.size());

                // Upload des nouvelles icônes
                if (detailIcons != null && detailIcons.length > 0) {
                    int iconIndex = 0;
                    for (ServiceSection section : sections) {
                        if (section.getDetails() != null) {
                            for (DetailObject detail : section.getDetails()) {
                                if ("".equals(detail.getIcon()) && iconIndex < detailIcons.length) {
                                    MultipartFile iconFile = detailIcons[iconIndex];
                                    if (iconFile != null && !iconFile.isEmpty()) {
                                        System.out.println("⬆️ Upload icône pour: " + detail.getTitle());
                                        String iconUrl = cloudinaryService.uploadIcon(
                                                iconFile,
                                                "xicom/icon"
                                        );
                                        detail.setIcon(iconUrl);
                                        System.out.println("✅ Icône uploadée: " + iconUrl);
                                    }
                                    iconIndex++;
                                } else if (detail.getIcon() != null && !detail.getIcon().isEmpty()) {
                                    System.out.println("⏭️ Icône existante conservée: " + detail.getIcon());
                                } else {
                                    System.out.println("⏭️ Pas d'icône pour: " + detail.getTitle());
                                }
                            }
                        }
                    }
                }

                // ✅ CRÉEZ UNE NOUVELLE LISTE pour forcer Hibernate à détecter le changement
                List<ServiceSection> newSections = new ArrayList<>(sections);
                existing.setSections(newSections);

                System.out.println("🔍 Sections après modification:");
                for (ServiceSection s : newSections) {
                    if (s.getDetails() != null) {
                        for (DetailObject d : s.getDetails()) {
                            System.out.println("  - " + d.getTitle() + " → " + d.getIcon());
                        }
                    }
                }
            }

            if (priceSectionsJson != null && !priceSectionsJson.isEmpty()) {
                ObjectMapper priceMapper = new ObjectMapper();
                List<PriceSection> priceSections = priceMapper.readValue(
                        priceSectionsJson,
                        new TypeReference<List<PriceSection>>() {}
                );
                existing.setPriceSections(priceSections);
            }

            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image, "xicom/service");
                existing.setImage(imageUrl);
                System.out.println("✅ Image uploadée: " + imageUrl);
            }

            if (icon != null && !icon.isEmpty()) {
                String iconUrl = cloudinaryService.uploadIcon(icon, "xicom/icon");
                existing.setIcon(iconUrl);
                System.out.println("✅ Icône principale uploadée: " + iconUrl);
            }

            ServiceEntity saved = serviceService.updateService(id, existing);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            System.err.println("❌ ERREUR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }
}
