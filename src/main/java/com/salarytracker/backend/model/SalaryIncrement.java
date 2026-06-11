package com.salarytracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "salary_increments")
public class SalaryIncrement {

    @Id
    private String id;
    private String userId;
    private LocalDate effectiveDate;
    private String employerName;
    private double previousBaseSalary;
    private double newBaseSalary;
    private double percentageIncrease;
    private String reason;

    public SalaryIncrement() {
    }

    public SalaryIncrement(String id, String userId, LocalDate effectiveDate, String employerName, 
                            double previousBaseSalary, double newBaseSalary, String reason) {
        this.id = id;
        this.userId = userId;
        this.effectiveDate = effectiveDate;
        this.employerName = employerName;
        this.previousBaseSalary = previousBaseSalary;
        this.newBaseSalary = newBaseSalary;
        this.reason = reason;
        calculatePercentage();
    }

    public void calculatePercentage() {
        if (previousBaseSalary > 0) {
            this.percentageIncrease = ((newBaseSalary - previousBaseSalary) / previousBaseSalary) * 100.0;
        } else {
            this.percentageIncrease = 0.0;
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public double getPreviousBaseSalary() { return previousBaseSalary; }
    public void setPreviousBaseSalary(double previousBaseSalary) { this.previousBaseSalary = previousBaseSalary; }

    public double getNewBaseSalary() { return newBaseSalary; }
    public void setNewBaseSalary(double newBaseSalary) { this.newBaseSalary = newBaseSalary; }

    public double getPercentageIncrease() { return percentageIncrease; }
    public void setPercentageIncrease(double percentageIncrease) { this.percentageIncrease = percentageIncrease; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
