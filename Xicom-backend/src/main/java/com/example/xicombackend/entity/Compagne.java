package com.example.xicombackend.entity;
import com.example.xicombackend.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compagne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Infos générales
    private String nomCampagne;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double budgetTotal;

    @Column(columnDefinition = "TEXT")
    private String objectifs;

    private String cible;
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> canauxCommunication = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String messageCle;

    @Column(columnDefinition = "TEXT")
    private String concept;

    @Column(columnDefinition = "TEXT")
    private String brief;

    // Stratégie
    @Column(columnDefinition = "TEXT")
    private String analyseSituation;

    @Column(columnDefinition = "TEXT")
    private String objectif;

    private LocalDate dateLine;
    private String ciblage;

    @Column(columnDefinition = "TEXT")
    private String messageMotsCles;

    @Column(columnDefinition = "TEXT")
    private String strategieCanauxCommunication;

    @Column(columnDefinition = "TEXT")
    private String benchmarkAnalyseConcurrentielle;

    // Exécution
    @Column(columnDefinition = "TEXT")
    private String creationContenu;

    @Column(columnDefinition = "TEXT")
    private String testPreliminaire;

    @Column(columnDefinition = "TEXT")
    private String ajustement;

    // Évaluation
    @Column(columnDefinition = "TEXT")
    private String postEvaluation;

    @Column(columnDefinition = "TEXT")
    private String analysesDonnees;

    @Column(columnDefinition = "TEXT")
    private String compilationDonnees;

    @Column(columnDefinition = "TEXT")
    private String rapportFinal;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
