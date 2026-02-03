package com.example.xicombackend.entity;
import com.example.xicombackend.converter.PriceConverter;
import com.example.xicombackend.converter.ServiceConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@Table(name = "service")
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private String Title;
    private String subTitle;
    private String image;
    private String icon;
    @Column(columnDefinition = "JSON")
    @Convert(converter = ServiceConverter.class)
    private List<ServiceSection> sections = new ArrayList<>();

    @Column(columnDefinition = "JSON")
    @Convert(converter = PriceConverter.class)
    private List<PriceSection> priceSections = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "service_partenaire",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "partenaire_id")
    )
    @JsonIgnore    // 👉 Ajoutez ceci
    private List<Partenaire> partenaires = new ArrayList<>();

}
