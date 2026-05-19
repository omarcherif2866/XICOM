package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Actualites;
import com.example.xicombackend.service.ActualiteService;
import com.example.xicombackend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/actualite")
@RequiredArgsConstructor
public class ActualiteController {

    private final ActualiteService actualiteService;
    private final CloudinaryService cloudinaryService;


    @PostMapping()
    public ResponseEntity<?> addActualite(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            // Validation
            if (title == null || title.isEmpty() || description == null || description.isEmpty()) {
                return ResponseEntity.badRequest().body("Paramètres d'entrée invalides.");
            }

            Actualites actualite = new Actualites();
            actualite.setTitle(title);
            actualite.setDescription(description);

            // Upload de l'image vers Cloudinary
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image, "xicom/actualite");
                actualite.setImage(imageUrl);
            }



            Actualites savedActualite = actualiteService.addActualites(actualite);

            return ResponseEntity.ok(savedActualite);


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }


    @GetMapping("{id}")
    public Actualites getActualitesById(@PathVariable Long id){
        return actualiteService.getActualitesById(id);
    }

    @DeleteMapping("{id}")
    public void deleteActualites(@PathVariable Long id) {
        actualiteService.deleteActualitesEntityById(id);
    }

    @GetMapping("/allActualitess")
    public ResponseEntity<List<Actualites>> getAllActualitess() {
        List<Actualites> Actualitess = actualiteService.getAllActualitess();
        return ResponseEntity.ok(Actualitess);
    }


    @PutMapping(value = "/{id}")
    public ResponseEntity<?> updateActualite(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            Actualites existing = actualiteService.getActualitesById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Actualité non trouvée");
            }

            // MAJ des champs
            existing.setTitle(title);
            existing.setDescription(description);
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image, "xicom/actualite");
                existing.setImage(imageUrl);
            }

            Actualites saved = actualiteService.updateActualites(id, existing);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }




}