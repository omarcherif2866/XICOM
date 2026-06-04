package com.example.xicombackend.entity;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProduitItem {
    private String type;  // "text" ou "image"
    private String value; // texte brut ou URL Cloudinary
}