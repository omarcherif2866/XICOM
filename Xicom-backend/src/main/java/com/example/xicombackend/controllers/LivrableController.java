package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.Livrable;
import com.example.xicombackend.service.LivrableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/livrables")
@RequiredArgsConstructor
public class LivrableController {

    private final LivrableService livrableService;

    @PostMapping
    public ResponseEntity<Livrable> create(@RequestBody Livrable livrable) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(livrableService.createLivrable(livrable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livrable> getById(@PathVariable Long id) {
        return ResponseEntity.ok(livrableService.getLivrableById(id));
    }

    @GetMapping
    public ResponseEntity<List<Livrable>> getAll() {
        return ResponseEntity.ok(livrableService.getAllLivrables());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livrable> update(@PathVariable Long id, @RequestBody Livrable livrable) {
        return ResponseEntity.ok(livrableService.updateLivrable(id, livrable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        livrableService.deleteLivrable(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{livrableId}/commandes")
    public ResponseEntity<List<Commande>> getCommandes(@PathVariable Long livrableId) {
        return ResponseEntity.ok(livrableService.getCommandesByLivrable(livrableId));
    }

    @GetMapping("/commande/{commandeId}")
    public ResponseEntity<Livrable> getByCommande(@PathVariable Long commandeId) {
        return ResponseEntity.ok(livrableService.getLivrableByCommande(commandeId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Livrable>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(livrableService.getLivrablesByUserId(userId));
    }

    @GetMapping("/all-with-client")
    public ResponseEntity<List<Livrable>> getAllWithClient() {
        return ResponseEntity.ok(livrableService.getAllLivrables());
    }

    @PostMapping(value = "/{id}/fichiers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addFichiers(
            @PathVariable Long id,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            return ResponseEntity.ok(livrableService.addFichiers(id, files));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur upload : " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/fichiers")
    public ResponseEntity<Livrable> removeFichier(
            @PathVariable Long id,
            @RequestParam String url) {
        return ResponseEntity.ok(livrableService.removeFichier(id, url));
    }

    @GetMapping("/{id}/fichiers")
    public ResponseEntity<List<String>> getFichiers(@PathVariable Long id) {
        return ResponseEntity.ok(livrableService.getFichiers(id));
    }

}
