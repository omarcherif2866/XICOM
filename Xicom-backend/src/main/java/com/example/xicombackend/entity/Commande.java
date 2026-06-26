package com.example.xicombackend.entity;

import com.example.xicombackend.converter.StringListConverter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceTitle;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "JSON")
    private List<String> detailTitles = new ArrayList<>();

    private String objectifs;
    private String analyseSituation;
    private String messageCle;
    private String brief;
    private String devis;
    private String delaiSouhaite;

    @Enumerated(EnumType.STRING)
    private StatusCommande status = StatusCommande.EN_COURS;

    @Enumerated(EnumType.STRING)
    private PayementStatus paymentStatus = PayementStatus.IMPAYEE;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "livrable_id")
    @JsonIgnoreProperties({"commandes", "hibernateLazyInitializer"})
    private Livrable livrable;

    private String packTitle;
    private String packPrice;


}