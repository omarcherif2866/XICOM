package com.example.xicombackend.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Actualites {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //gerer par la base
    @Setter(AccessLevel.NONE)
    private long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;

}
