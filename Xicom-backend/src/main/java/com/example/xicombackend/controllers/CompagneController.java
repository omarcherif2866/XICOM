package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Compagne;
import com.example.xicombackend.service.CompagneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compagne")
@RequiredArgsConstructor
public class CompagneController {

    private final CompagneService compagneService;

    @PostMapping
    public ResponseEntity<Compagne> create(@RequestBody Compagne compagne) {
        return ResponseEntity.status(HttpStatus.CREATED).body(compagneService.create(compagne));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Compagne> update(@PathVariable Long id, @RequestBody Compagne compagne) {
        return ResponseEntity.ok(compagneService.update(id, compagne));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        compagneService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compagne> getById(@PathVariable Long id) {
        return ResponseEntity.ok(compagneService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Compagne>> getAll() {
        return ResponseEntity.ok(compagneService.getAll());
    }


    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(compagneService.count());
    }


}
