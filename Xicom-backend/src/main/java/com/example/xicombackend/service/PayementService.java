package com.example.xicombackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PayementService {
    @Value("${square.sandbox.access-token}")
    private String accessToken;

    @Value("${square.sandbox.location-id}")
    private String locationId;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SQUARE_URL = "https://connect.squareupsandbox.com/v2/payments";

    public String createPayment(String sourceId, long amountInCents) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Square-Version", "2024-01-18");
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> amountMoney = new HashMap<>();
        amountMoney.put("amount", amountInCents);
        amountMoney.put("currency", "EUR");

        Map<String, Object> body = new HashMap<>();
        body.put("source_id", sourceId);
        body.put("amount_money", amountMoney);
        body.put("location_id", locationId);
        body.put("idempotency_key", UUID.randomUUID().toString());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(SQUARE_URL, request, Map.class);

        Map payment = (Map) response.getBody().get("payment");
        return (String) payment.get("id");
    }
}