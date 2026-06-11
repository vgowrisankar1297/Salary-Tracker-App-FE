package com.salarytracker.backend.dto;

import com.salarytracker.backend.model.SalaryRecord;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private double totalGrossEarnings;
    private double totalDeductions;
    private double totalNetReceived;
    private double averageMonthlyNet;
    private double latestBaseSalary;
    private int incrementCount;
    
    private List<SalaryRecord> recentRecords;
    private List<MonthlyTrendDto> monthlyTrend;
    
    private Map<String, Double> deductionBreakdown;
    private Map<String, Double> allowanceBreakdown;
    private Map<String, Double> bonusBreakdown;
    
    // Spending tracker metrics
    private double totalExpenses;
    private double spendingAllowance; // Latest month's budget allowance
    private Map<String, Double> expensesByCategory;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(double totalGrossEarnings, double totalDeductions, double totalNetReceived, 
                              double averageMonthlyNet, double latestBaseSalary, int incrementCount, 
                              List<SalaryRecord> recentRecords, List<MonthlyTrendDto> monthlyTrend, 
                              Map<String, Double> deductionBreakdown, Map<String, Double> allowanceBreakdown, 
                              Map<String, Double> bonusBreakdown, double totalExpenses, double spendingAllowance,
                              Map<String, Double> expensesByCategory) {
        this.totalGrossEarnings = totalGrossEarnings;
        this.totalDeductions = totalDeductions;
        this.totalNetReceived = totalNetReceived;
        this.averageMonthlyNet = averageMonthlyNet;
        this.latestBaseSalary = latestBaseSalary;
        this.incrementCount = incrementCount;
        this.recentRecords = recentRecords;
        this.monthlyTrend = monthlyTrend;
        this.deductionBreakdown = deductionBreakdown;
        this.allowanceBreakdown = allowanceBreakdown;
        this.bonusBreakdown = bonusBreakdown;
        this.totalExpenses = totalExpenses;
        this.spendingAllowance = spendingAllowance;
        this.expensesByCategory = expensesByCategory;
    }

    // Getters and Setters
    public double getTotalGrossEarnings() { return totalGrossEarnings; }
    public void setTotalGrossEarnings(double totalGrossEarnings) { this.totalGrossEarnings = totalGrossEarnings; }

    public double getTotalDeductions() { return totalDeductions; }
    public void setTotalDeductions(double totalDeductions) { this.totalDeductions = totalDeductions; }

    public double getTotalNetReceived() { return totalNetReceived; }
    public void setTotalNetReceived(double totalNetReceived) { this.totalNetReceived = totalNetReceived; }

    public double getAverageMonthlyNet() { return averageMonthlyNet; }
    public void setAverageMonthlyNet(double averageMonthlyNet) { this.averageMonthlyNet = averageMonthlyNet; }

    public double getLatestBaseSalary() { return latestBaseSalary; }
    public void setLatestBaseSalary(double latestBaseSalary) { this.latestBaseSalary = latestBaseSalary; }

    public int getIncrementCount() { return incrementCount; }
    public void setIncrementCount(int incrementCount) { this.incrementCount = incrementCount; }

    public List<SalaryRecord> getRecentRecords() { return recentRecords; }
    public void setRecentRecords(List<SalaryRecord> recentRecords) { this.recentRecords = recentRecords; }

    public List<MonthlyTrendDto> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(List<MonthlyTrendDto> monthlyTrend) { this.monthlyTrend = monthlyTrend; }

    public Map<String, Double> getDeductionBreakdown() { return deductionBreakdown; }
    public void setDeductionBreakdown(Map<String, Double> deductionBreakdown) { this.deductionBreakdown = deductionBreakdown; }

    public Map<String, Double> getAllowanceBreakdown() { return allowanceBreakdown; }
    public void setAllowanceBreakdown(Map<String, Double> allowanceBreakdown) { this.allowanceBreakdown = allowanceBreakdown; }

    public Map<String, Double> getBonusBreakdown() { return bonusBreakdown; }
    public void setBonusBreakdown(Map<String, Double> bonusBreakdown) { this.bonusBreakdown = bonusBreakdown; }

    public double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(double totalExpenses) { this.totalExpenses = totalExpenses; }

    public double getSpendingAllowance() { return spendingAllowance; }
    public void setSpendingAllowance(double spendingAllowance) { this.spendingAllowance = spendingAllowance; }

    public Map<String, Double> getExpensesByCategory() { return expensesByCategory; }
    public void setExpensesByCategory(Map<String, Double> expensesByCategory) { this.expensesByCategory = expensesByCategory; }

    public static class MonthlyTrendDto {
        private String month; // "YYYY-MM"
        private double gross;
        private double net;
        private double deductions;
        private String employerName;
        private double expenses;
        private double spendingAllowance;

        public MonthlyTrendDto() {
        }

        public MonthlyTrendDto(String month, double gross, double net, double deductions, String employerName, double expenses, double spendingAllowance) {
            this.month = month;
            this.gross = gross;
            this.net = net;
            this.deductions = deductions;
            this.employerName = employerName;
            this.expenses = expenses;
            this.spendingAllowance = spendingAllowance;
        }

        // Getters and Setters
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public double getGross() { return gross; }
        public void setGross(double gross) { this.gross = gross; }

        public double getNet() { return net; }
        public void setNet(double net) { this.net = net; }

        public double getDeductions() { return deductions; }
        public void setDeductions(double deductions) { this.deductions = deductions; }

        public String getEmployerName() { return employerName; }
        public void setEmployerName(String employerName) { this.employerName = employerName; }

        public double getExpenses() { return expenses; }
        public void setExpenses(double expenses) { this.expenses = expenses; }

        public double getSpendingAllowance() { return spendingAllowance; }
        public void setSpendingAllowance(double spendingAllowance) { this.spendingAllowance = spendingAllowance; }
    }
}
