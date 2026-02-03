package com.example.xicombackend.converter;


import com.example.xicombackend.entity.ServiceSection;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;
@Converter
public class ServiceConverter implements AttributeConverter<List<ServiceSection>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ServiceSection> sections) {
        try {
            return objectMapper.writeValueAsString(sections);
        } catch (Exception e) {
            throw new IllegalArgumentException("Erreur conversion Section -> JSON", e);
        }
    }

    @Override
    public List<ServiceSection> convertToEntityAttribute(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<ServiceSection>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
