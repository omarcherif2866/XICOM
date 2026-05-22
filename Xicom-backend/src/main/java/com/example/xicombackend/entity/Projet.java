package com.example.xicombackend.entity;

import com.example.xicombackend.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Infos générales
    private String client;
    private String secteur;
    private String categorie;
    private String responsableNomPrenom;
    private String responsableAdresse;
    private String responsableTelephone;
    private String responsableEmail;

    // Identité visuelle — listes d'URLs Cloudinary
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> logo = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> avatars = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> charteGraphique = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> policesCaracteres = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> imagesIllustrations = new ArrayList<>();

    private String couleurSecondaire;
    private String couleurANePasUtiliser;
    private String autresDonnees;
    private String autresCommentaires;

    // Présence en ligne
    private String siteWeb;
    private String reseauxSociaux;
    private String coordonnees;
    private String canauxContact;
    private String servicesReconnusOutils;
    private String concurrent;

    // Produits & fidélité — listes
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> lesProduits = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> lesAvis = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> lesPublications = new ArrayList<>();

    private String programmeFidelite;
    private String hobbiesMarque;
    private String consommation;
    private String achatsRealises;
    private String frequenceAchat;
    private String moyenPaiement;
    private String pagesConsultees;
    private String produitsPlusVisites;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}