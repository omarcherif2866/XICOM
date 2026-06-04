package com.example.xicombackend.converter;

import com.example.xicombackend.entity.ProduitItem;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class ProduitItemListConverter implements AttributeConverter<List<ProduitItem>, String> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ProduitItem> list) {
        try {
            return list == null ? "[]" : mapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    @Override
    public List<ProduitItem> convertToEntityAttribute(String json) {
        try {
            return json == null ? new ArrayList<>() :
                    mapper.readValue(json, mapper.getTypeFactory()
                            .constructCollectionType(List.class, ProduitItem.class));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}