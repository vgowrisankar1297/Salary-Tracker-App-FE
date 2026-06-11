package com.salarytracker.backend.controller;

import com.salarytracker.backend.model.SalaryRecord;
import com.salarytracker.backend.service.SalaryRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@CrossOrigin("*")
public class SalaryRecordController {

    private final SalaryRecordService service;

    @Autowired
    public SalaryRecordController(SalaryRecordService service) {
        this.service = service;
    }

    @GetMapping
    public List<SalaryRecord> getAllRecords() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getAllRecords(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryRecord> getRecordById(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getRecordById(userId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SalaryRecord createRecord(@RequestBody SalaryRecord record) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.createRecord(userId, record);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryRecord> updateRecord(@PathVariable String id, @RequestBody SalaryRecord recordDetails) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            return ResponseEntity.ok(service.updateRecord(userId, id, recordDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable String id) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            service.deleteRecord(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<SalaryRecord> records = service.getAllRecords(userId);
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Month,Employer Name,Base Salary,Gross Salary,Total Deductions,Net Salary,Payment Date,Status,Notes,Spending Allowance\n");
        for (SalaryRecord record : records) {
            csv.append(String.format("%s,%s,\"%s\",%.2f,%.2f,%.2f,%.2f,%s,%s,\"%s\",%.2f\n",
                record.getId(),
                record.getMonth(),
                record.getEmployerName() != null ? record.getEmployerName().replace("\"", "\"\"") : "",
                record.getBaseSalary(),
                record.getGrossSalary(),
                record.getTotalDeductions(),
                record.getNetSalary(),
                record.getPaymentDate(),
                record.getStatus(),
                record.getNotes() != null ? record.getNotes().replace("\"", "\"\"").replace("\n", " ") : "",
                record.getSpendingAllowance()
            ));
        }
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=salary_records.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csv.toString());
    }
}
