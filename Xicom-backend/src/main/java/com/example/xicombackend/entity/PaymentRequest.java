package com.example.xicombackend.entity;

import lombok.*;

@Getter @Setter
public class PaymentRequest {
    private String sourceId;
    private String amount;
    private Long commandeId;
}
