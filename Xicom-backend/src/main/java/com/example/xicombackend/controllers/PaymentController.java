package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.PayementStatus;
import com.example.xicombackend.entity.PaymentRequest;
import com.example.xicombackend.repository.CommandeRepository;
import com.example.xicombackend.service.PayementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PayementService paymentService;
    private final CommandeRepository commandeRepository;

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody PaymentRequest request) {
        try {
            long amountInCents = (long)(Double.parseDouble(request.getAmount()) * 100);
            String paymentId = paymentService.createPayment(request.getSourceId(), amountInCents);

            commandeRepository.findById(request.getCommandeId()).ifPresent(c -> {
                c.setPaymentStatus(PayementStatus.PAYEE);
                commandeRepository.save(c);
            });

            return ResponseEntity.ok(Map.of("paymentId", paymentId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
