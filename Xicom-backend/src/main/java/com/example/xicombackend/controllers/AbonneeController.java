package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Abonnee;
import com.example.xicombackend.service.AbonneeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/abonnee")
@RequiredArgsConstructor
public class AbonneeController {

    private final AbonneeService abonneeService;

    @PostMapping()
    public ResponseEntity<?> addabonnee(@RequestBody Abonnee abonnee) {
        try {
            if (abonnee.getName() == null || abonnee.getEmail() == null) {
                return ResponseEntity.badRequest().body("Paramètres invalides.");
            }
            Abonnee saved = abonneeService.addAbonne(abonnee);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countAbonnes() {
        return ResponseEntity.ok(abonneeService.countAbonnes());
    }

    @GetMapping
    public ResponseEntity<List<Abonnee>> getAllAbonnes() {
        return ResponseEntity.ok(abonneeService.getAllAbonnes());
    }

}
