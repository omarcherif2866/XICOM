package com.example.xicombackend.dto;

import java.util.List;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommandeRequest {
    private String serviceTitle;
    private List<String> detailTitles;
    private Integer userId;
    private String objectifs;
    private String analyseSituation;
    private String messageCle;
    private String brief;
    private String devis;
    private String delaiSouhaite;
    // Getters & Setters
}