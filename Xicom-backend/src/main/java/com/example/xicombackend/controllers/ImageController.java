package com.example.xicombackend.controllers;

import org.springframework.web.bind.annotation.RestController;
import com.example.xicombackend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final CloudinaryService cloudinaryService;

    @GetMapping("/icons")
    public ResponseEntity<?> getAvailableIcons() {
        try {
            List<String> icons = cloudinaryService.listIconsFromFolder("xicom/icon");
            return ResponseEntity.ok(icons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération des icônes: " + e.getMessage());
        }
    }

}
