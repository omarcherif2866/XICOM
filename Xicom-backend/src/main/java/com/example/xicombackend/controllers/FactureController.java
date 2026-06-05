package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Facture;
import com.example.xicombackend.entity.StatusFacture;
import com.example.xicombackend.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/factures")
@RequiredArgsConstructor

public class FactureController {

    private final FactureService factureService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam Long commandeId,
            @RequestParam Integer userId,
            @RequestParam Double montant,
            @RequestParam(value = "fichier", required = false) MultipartFile fichier) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(factureService.createFacture(commandeId, userId, montant, fichier));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Facture>> getAll() {
        return ResponseEntity.ok(factureService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Facture>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(factureService.getByUserId(userId));
    }

    @GetMapping("/commande/{commandeId}")
    public ResponseEntity<List<Facture>> getByCommandeId(@PathVariable Long commandeId) {
        return ResponseEntity.ok(factureService.getByCommandeId(commandeId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Facture> updateStatus(
            @PathVariable Long id,
            @RequestParam StatusFacture status) {
        return ResponseEntity.ok(factureService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}