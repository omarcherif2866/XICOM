package com.example.xicombackend.entity;

import com.example.xicombackend.converter.DetailObjectListConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceSection {
    String headline;
    String subtitle;

    @Column(columnDefinition = "JSON")
    @Convert(converter = DetailObjectListConverter.class)
    List<DetailObject> details = new ArrayList<>();
}
