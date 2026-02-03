package com.example.xicombackend.converter;

import com.example.xicombackend.entity.DetailObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Collections;
import java.util.List;

@Converter
public class DetailObjectListConverter implements AttributeConverter<List<DetailObject>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<DetailObject> attribute) {
        try {
            if (attribute == null || attribute.isEmpty()) {
                return "[]"; // valeur JSON vide
            }
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erreur lors de la conversion en JSON", e);
        }
    }

    @Override
    public List<DetailObject> convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.trim().isEmpty()) {
                return Collections.emptyList(); // éviter null
            }
            return objectMapper.readValue(dbData,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, DetailObject.class));
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la conversion du JSON vers List<DetailObject>", e);
        }
    }
}
