package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.RDV;
import com.example.xicombackend.service.RDVService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rdv")
@RequiredArgsConstructor
public class RDVController {

    private final RDVService rdvService;

    @PostMapping
    public ResponseEntity<?> createRDV(@RequestBody RDV rdv) {
        try {
            RDV createdRDV = rdvService.addRDV(rdv);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRDV);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la création du RDV : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création du RDV : " + e.getMessage());
        }
    }

}
