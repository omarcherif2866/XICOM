package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.RDV;
import com.example.xicombackend.repository.RDVRepository;
import com.example.xicombackend.service.RDVService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rdv")
@RequiredArgsConstructor
public class RDVController {

    private final RDVService rdvService;
    private final RDVRepository rDVRepository;

    @PostMapping
    public ResponseEntity<?> createRDV(@RequestBody RDV rdv) {
        try {
            RDV createdRDV = rdvService.addRDV(rdv);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRDV);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la création du RDV : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création du RDV : " + e.getMessage());
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RDV> updateRDV(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String date        = body.get("date");
        String heure       = body.get("heure");
        String lien_reunion = body.get("lien_reunion");

        return ResponseEntity.ok(rdvService.updateRDV(id, date, heure, lien_reunion));
    }

    @GetMapping
    public ResponseEntity<List<RDV>> getAllRDV() {
        return ResponseEntity.ok(rdvService.getAllRDV());
    }

    @GetMapping("/client/{email}")
    public ResponseEntity<List<RDV>> getRDVByClient(@PathVariable String email) {
        return ResponseEntity.ok(rdvService.getRDVByClient(email));
    }

    @GetMapping("/calendrier")
    public ResponseEntity<List<Map<String, Object>>> getRDVCalendrier() {
        List<RDV> rdvList = rDVRepository.findAll();
        List<Map<String, Object>> events = rdvList.stream()
                .filter(rdv -> rdv.getDate() != null && rdv.getHeure() != null)
                .map(rdv -> {
                    Map<String, Object> event = new HashMap<>();
                    event.put("id", rdv.getId());
                    event.put("title", rdv.getName() + " " + rdv.getSurname());
                    event.put("start", rdv.getDate() + "T" + rdv.getHeure());
                    event.put("email", rdv.getEmail());
                    event.put("lien", rdv.getLien_reunion());
                    return event;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

}
