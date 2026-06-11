package com.salarytracker.backend.service;

import com.salarytracker.backend.dto.DashboardStatsDto;
import com.salarytracker.backend.model.Expense;
import com.salarytracker.backend.model.SalaryIncrement;
import com.salarytracker.backend.model.SalaryRecord;
import com.salarytracker.backend.repository.ExpenseRepository;
import com.salarytracker.backend.repository.SalaryIncrementRepository;
import com.salarytracker.backend.repository.SalaryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final SalaryRecordRepository recordRepository;
    private final SalaryIncrementRepository incrementRepository;
    private final ExpenseRepository expenseRepository;

    @Autowired
    public DashboardService(SalaryRecordRepository recordRepository, 
                            SalaryIncrementRepository incrementRepository, 
                            ExpenseRepository expenseRepository) {
        this.recordRepository = recordRepository;
        this.incrementRepository = incrementRepository;
        this.expenseRepository = expenseRepository;
    }

    public DashboardStatsDto getDashboardStats(String userId) {
        List<SalaryRecord> records = recordRepository.findAllByUserIdOrderByMonthDesc(userId);
        List<SalaryIncrement> increments = incrementRepository.findAllByUserIdOrderByEffectiveDateDesc(userId);
        List<Expense> expenses = expenseRepository.findAllByUserIdOrderByDateDesc(userId);

        double totalGross = 0;
        double totalDeductions = 0;
        double totalNet = 0;
        double latestBase = 0;
        double spendingAllowance = 0;

        Map<String, Double> deductionMap = new HashMap<>();
        Map<String, Double> allowanceMap = new HashMap<>();
        Map<String, Double> bonusMap = new HashMap<>();

        if (!records.isEmpty()) {
            SalaryRecord latestRecord = records.get(0);
            latestBase = latestRecord.getBaseSalary();
            spendingAllowance = latestRecord.getSpendingAllowance();
            
            for (SalaryRecord record : records) {
                totalGross += record.getGrossSalary();
                totalDeductions += record.getTotalDeductions();
                totalNet += record.getNetSalary();

                // Accumulate deductions
                if (record.getDeductions() != null) {
                    record.getDeductions().forEach((key, val) -> {
                        String norm = normalizeKey(key, "Deduction");
                        deductionMap.put(norm, deductionMap.getOrDefault(norm, 0.0) + val);
                    });
                }

                // Accumulate allowances
                if (record.getAllowances() != null) {
                    record.getAllowances().forEach((key, val) -> {
                        String norm = normalizeKey(key, "Allowance");
                        allowanceMap.put(norm, allowanceMap.getOrDefault(norm, 0.0) + val);
                    });
                }

                // Accumulate bonuses
                if (record.getBonuses() != null) {
                    record.getBonuses().forEach((key, val) -> {
                        String norm = normalizeKey(key, "Bonus");
                        bonusMap.put(norm, bonusMap.getOrDefault(norm, 0.0) + val);
                    });
                }
            }
        }

        double avgNet = records.isEmpty() ? 0.0 : totalNet / records.size();

        // Calculate expense metrics
        double totalExpenses = expenses.stream().mapToDouble(Expense::getAmount).sum();
        Map<String, Double> expensesByCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory() == null || e.getCategory().isBlank() ? "Other" : e.getCategory(),
                        Collectors.summingDouble(Expense::getAmount)
                ));

        // Group expenses by month
        Map<String, Double> expensesByMonth = expenses.stream()
                .filter(e -> e.getMonth() != null)
                .collect(Collectors.groupingBy(
                        Expense::getMonth,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        // Create chronological monthly trend
        List<DashboardStatsDto.MonthlyTrendDto> trend = records.stream()
                .map(r -> new DashboardStatsDto.MonthlyTrendDto(
                        r.getMonth(),
                        r.getGrossSalary(),
                        r.getNetSalary(),
                        r.getTotalDeductions(),
                        r.getEmployerName(),
                        expensesByMonth.getOrDefault(r.getMonth(), 0.0),
                        r.getSpendingAllowance()
                ))
                .collect(Collectors.toList());
        Collections.reverse(trend); // order by month ASC for chart

        List<SalaryRecord> recent = records.stream()
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardStatsDto(
                totalGross,
                totalDeductions,
                totalNet,
                avgNet,
                latestBase,
                increments.size(),
                recent,
                trend,
                deductionMap,
                allowanceMap,
                bonusMap,
                totalExpenses,
                spendingAllowance,
                expensesByCategory
        );
    }

    private String normalizeKey(String key, String type) {
        if (key == null || key.isBlank()) return "Other";
        String trimmed = key.trim();
        
        if (type.equals("Deduction")) {
            if (trimmed.equalsIgnoreCase("tax") || trimmed.equalsIgnoreCase("incometax") || trimmed.equalsIgnoreCase("income tax")) {
                return "Income Tax";
            }
            if (trimmed.equalsIgnoreCase("pf") || trimmed.equalsIgnoreCase("providentfund") || trimmed.equalsIgnoreCase("provident fund")) {
                return "Provident Fund";
            }
            if (trimmed.equalsIgnoreCase("insurance") || trimmed.equalsIgnoreCase("healthinsurance") || trimmed.equalsIgnoreCase("health insurance")) {
                return "Health Insurance";
            }
            if (trimmed.equalsIgnoreCase("professionaltax") || trimmed.equalsIgnoreCase("professional tax")) {
                return "Professional Tax";
            }
        } else if (type.equals("Allowance")) {
            if (trimmed.equalsIgnoreCase("hra") || trimmed.equalsIgnoreCase("housing") || trimmed.equalsIgnoreCase("house rent allowance")) {
                return "House Rent Allowance";
            }
            if (trimmed.equalsIgnoreCase("medical") || trimmed.equalsIgnoreCase("medical allowance")) {
                return "Medical Allowance";
            }
            if (trimmed.equalsIgnoreCase("lta") || trimmed.equalsIgnoreCase("travel") || trimmed.equalsIgnoreCase("travel allowance")) {
                return "Travel Allowance";
            }
            if (trimmed.equalsIgnoreCase("special") || trimmed.equalsIgnoreCase("special allowance")) {
                return "Special Allowance";
            }
        } else if (type.equals("Bonus")) {
            if (trimmed.equalsIgnoreCase("festive") || trimmed.equalsIgnoreCase("festival bonus")) {
                return "Festive Bonus";
            }
            if (trimmed.equalsIgnoreCase("performance") || trimmed.equalsIgnoreCase("performance bonus")) {
                return "Performance Bonus";
            }
        }
        
        if (trimmed.length() <= 3) {
            return trimmed.toUpperCase();
        }
        return Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1).toLowerCase();
    }
}
