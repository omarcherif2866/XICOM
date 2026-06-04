package com.example.xicombackend.entity;

import com.example.xicombackend.converter.StringListConverter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Livrable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> fichierUrl = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private StatusLivrable status = StatusLivrable.EN_ATTENTE;

    private LocalDateTime dateCreation = LocalDateTime.now();
    private LocalDateTime dateLivraison;

    @OneToMany(mappedBy = "livrable", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"livrable", "hibernateLazyInitializer"})
    private List<Commande> commandes = new ArrayList<>();
}