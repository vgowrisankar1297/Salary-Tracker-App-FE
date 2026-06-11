package com.salarytracker.backend.service;

import com.salarytracker.backend.model.Expense;
import com.salarytracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    @Autowired
    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public List<Expense> getExpensesByUserId(String userId) {
        return repository.findAllByUserIdOrderByDateDesc(userId);
    }

    public List<Expense> getExpensesByUserIdAndMonth(String userId, String month) {
        return repository.findAllByUserIdAndMonth(userId, month);
    }

    public Expense createExpense(String userId, Expense expense) {
        expense.setUserId(userId);
        return repository.save(expense);
    }

    public Expense updateExpense(String userId, String expenseId, Expense details) {
        Expense expense = repository.findById(expenseId)
                .filter(e -> e.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        expense.setTitle(details.getTitle());
        expense.setAmount(details.getAmount());
        expense.setCategory(details.getCategory());
        expense.setDate(details.getDate());
        return repository.save(expense);
    }

    public void deleteExpense(String userId, String expenseId) {
        Expense expense = repository.findById(expenseId)
                .filter(e -> e.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));
        repository.delete(expense);
    }
}
