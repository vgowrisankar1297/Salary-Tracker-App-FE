package com.salarytracker.backend.controller;

import com.salarytracker.backend.model.Expense;
import com.salarytracker.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    @Autowired
    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Expense> getExpenses() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getExpensesByUserId(userId);
    }

    @GetMapping("/month/{month}")
    public List<Expense> getExpensesByMonth(@PathVariable String month) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getExpensesByUserIdAndMonth(userId, month);
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.createExpense(userId, expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable String id, @RequestBody Expense details) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            return ResponseEntity.ok(service.updateExpense(userId, id, details));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            service.deleteExpense(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
