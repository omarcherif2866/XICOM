package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Partenaire;
import com.example.xicombackend.service.CloudinaryService;
import com.example.xicombackend.service.PartenaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


    @RestController
    @RequestMapping("/partenaire")
    @RequiredArgsConstructor
    public class PartenaireController {

        private final PartenaireService partenaireService;
        private final CloudinaryService cloudinaryService;


        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> addpartenaire(
                @RequestParam("name") String name,
                @RequestParam("description") String description,
                @RequestParam(value = "image", required = false) MultipartFile image) {
            try {
                // Validation
                if (name == null || name.isEmpty() || description == null || description.isEmpty()) {
                    return ResponseEntity.badRequest().body("Paramètres d'entrée invalides.");
                }

                Partenaire partenaire = new Partenaire();
                partenaire.setName(name);
                partenaire.setDescription(description);

                // Upload de l'image vers Cloudinary
                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "xicom/partenaire");
                    partenaire.setImage(imageUrl);
                }


                Partenaire savedpartenaire = partenaireService.addPartenaire(partenaire);

                return ResponseEntity.ok(savedpartenaire);

            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de l'upload de l'image : " + e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
            }
        }


        @GetMapping("{id}")
        public Partenaire getPartenaireById(@PathVariable Long id) {
            return partenaireService.getPartenaireById(id);
        }

        @DeleteMapping("{id}")
        public void deletePartenaire(@PathVariable Long id) {
            partenaireService.deletePartenaireEntityById(id);
        }

        @GetMapping("/allPartenaires")
        public ResponseEntity<List<Partenaire>> getAllPartenaires() {
            List<Partenaire> Partenaires = partenaireService.getAllPartenaires();
            return ResponseEntity.ok(Partenaires);
        }


        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> updatepartenaire(
                @PathVariable Long id,
                @RequestParam("name") String name,
                @RequestParam("description") String description,
                @RequestParam(value = "image", required = false) MultipartFile image) {

            try {
                Partenaire existing = partenaireService.getPartenaireById(id);
                if (existing == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("partenaire non trouvée");
                }

                // MAJ des champs
                existing.setName(name);
                existing.setDescription(description);

                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "xicom/partenaire");
                    existing.setImage(imageUrl);
                }

                Partenaire saved = partenaireService.updatePartenaire(id, existing);
                return ResponseEntity.ok(saved);

            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de l'upload de l'image : " + e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur serveur : " + e.getMessage());
            }
        }


        @GetMapping("/services/{serviceId}")
        public ResponseEntity<List<Partenaire>> getByService(@PathVariable Long serviceId) {
            List<Partenaire> partenaire = partenaireService.getPartenaireByServices(serviceId);
            return ResponseEntity.ok(partenaire);
        }
    }
