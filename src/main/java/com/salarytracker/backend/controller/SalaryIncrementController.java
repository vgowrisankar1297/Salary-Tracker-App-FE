package com.salarytracker.backend.controller;

import com.salarytracker.backend.model.SalaryIncrement;
import com.salarytracker.backend.service.SalaryIncrementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/increments")
@CrossOrigin("*")
public class SalaryIncrementController {

    private final SalaryIncrementService service;

    @Autowired
    public SalaryIncrementController(SalaryIncrementService service) {
        this.service = service;
    }

    @GetMapping
    public List<SalaryIncrement> getAllIncrements() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getAllIncrements(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryIncrement> getIncrementById(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getIncrementById(userId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SalaryIncrement createIncrement(@RequestBody SalaryIncrement increment) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.createIncrement(userId, increment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryIncrement> updateIncrement(@PathVariable String id, @RequestBody SalaryIncrement incrementDetails) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            return ResponseEntity.ok(service.updateIncrement(userId, id, incrementDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncrement(@PathVariable String id) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            service.deleteIncrement(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
