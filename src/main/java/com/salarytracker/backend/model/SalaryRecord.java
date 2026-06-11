package com.salarytracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "salary_records")
public class SalaryRecord {

    @Id
    private String id;
    private String userId;
    private String month; // Format: "YYYY-MM"
    private String employerName;
    private double baseSalary;
    private Map<String, Double> allowances = new HashMap<>();
    private Map<String, Double> bonuses = new HashMap<>();
    private Map<String, Double> deductions = new HashMap<>();
    private double grossSalary;
    private double totalDeductions;
    private double netSalary;
    private LocalDate paymentDate;
    private PaymentStatus status;
    private String notes;
    private double spendingAllowance; // monthly budget limit

    public SalaryRecord() {
    }

    public SalaryRecord(String id, String userId, String month, String employerName, double baseSalary, 
                        Map<String, Double> allowances, Map<String, Double> bonuses, 
                        Map<String, Double> deductions, LocalDate paymentDate, 
                        PaymentStatus status, String notes, double spendingAllowance) {
        this.id = id;
        this.userId = userId;
        this.month = month;
        this.employerName = employerName;
        this.baseSalary = baseSalary;
        this.allowances = allowances != null ? allowances : new HashMap<>();
        this.bonuses = bonuses != null ? bonuses : new HashMap<>();
        this.deductions = deductions != null ? deductions : new HashMap<>();
        this.paymentDate = paymentDate;
        this.status = status;
        this.notes = notes;
        this.spendingAllowance = spendingAllowance;
        calculateTotals();
    }

    public void calculateTotals() {
        double sumAllowances = allowances != null ? allowances.values().stream().mapToDouble(Double::doubleValue).sum() : 0.0;
        double sumBonuses = bonuses != null ? bonuses.values().stream().mapToDouble(Double::doubleValue).sum() : 0.0;
        double sumDeductions = deductions != null ? deductions.values().stream().mapToDouble(Double::doubleValue).sum() : 0.0;

        this.grossSalary = this.baseSalary + sumAllowances + sumBonuses;
        this.totalDeductions = sumDeductions;
        this.netSalary = this.grossSalary - this.totalDeductions;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }

    public Map<String, Double> getAllowances() { return allowances; }
    public void setAllowances(Map<String, Double> allowances) { this.allowances = allowances != null ? allowances : new HashMap<>(); }

    public Map<String, Double> getBonuses() { return bonuses; }
    public void setBonuses(Map<String, Double> bonuses) { this.bonuses = bonuses != null ? bonuses : new HashMap<>(); }

    public Map<String, Double> getDeductions() { return deductions; }
    public void setDeductions(Map<String, Double> deductions) { this.deductions = deductions != null ? deductions : new HashMap<>(); }

    public double getGrossSalary() { return grossSalary; }
    public void setGrossSalary(double grossSalary) { this.grossSalary = grossSalary; }

    public double getTotalDeductions() { return totalDeductions; }
    public void setTotalDeductions(double totalDeductions) { this.totalDeductions = totalDeductions; }

    public double getNetSalary() { return netSalary; }
    public void setNetSalary(double netSalary) { this.netSalary = netSalary; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public double getSpendingAllowance() { return spendingAllowance; }
    public void setSpendingAllowance(double spendingAllowance) { this.spendingAllowance = spendingAllowance; }
}
