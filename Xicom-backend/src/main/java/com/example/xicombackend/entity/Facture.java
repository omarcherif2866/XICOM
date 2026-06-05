package com.example.xicombackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;
    private String fichierUrl;        // ← AJOUTER

    private LocalDateTime date = LocalDateTime.now();

    private Double montant;

    @Enumerated(EnumType.STRING)
    private StatusFacture status = StatusFacture.EN_ATTENTE;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    @JsonIgnoreProperties({"factures", "hibernateLazyInitializer"})
    private Commande commande;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"factures", "hibernateLazyInitializer"})
    private User user;

    @PrePersist
    public void generateReference() {
        this.reference = "FAC-" + System.currentTimeMillis();
    }
}