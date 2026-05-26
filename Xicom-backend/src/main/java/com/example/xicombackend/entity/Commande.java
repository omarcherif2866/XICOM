package com.example.xicombackend.entity;

import com.example.xicombackend.converter.StringListConverter;
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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}