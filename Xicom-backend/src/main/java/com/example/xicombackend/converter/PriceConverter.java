package com.example.xicombackend.converter;

import com.example.xicombackend.entity.PriceSection;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;
@Converter
public class PriceConverter implements AttributeConverter<List<PriceSection>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<PriceSection> sections) {
        try {
            return objectMapper.writeValueAsString(sections);
        } catch (Exception e) {
            throw new IllegalArgumentException("Erreur conversion Section -> JSON", e);
        }
    }

    @Override
    public List<PriceSection> convertToEntityAttribute(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<PriceSection>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
