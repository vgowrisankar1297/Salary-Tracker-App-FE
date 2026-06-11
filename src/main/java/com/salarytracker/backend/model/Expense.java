package com.salarytracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "expenses")
public class Expense {

    @Id
    private String id;
    private String userId;
    private String title;
    private double amount;
    private String category;
    private LocalDate date;
    private String month; // Format: "YYYY-MM"

    public Expense() {
    }

    public Expense(String id, String userId, String title, double amount, String category, LocalDate date) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.date = date;
        if (date != null) {
            this.month = date.toString().substring(0, 7);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { 
        this.date = date; 
        if (date != null) {
            this.month = date.toString().substring(0, 7);
        }
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
