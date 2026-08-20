package com.example.xicombackend.dto;

import lombok.Data;

@Data
public class ContactRequest {
    private String nom;
    private String email;
    private String sujet;
    private String phone;
    private String message;
}