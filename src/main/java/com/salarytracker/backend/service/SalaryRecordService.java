package com.salarytracker.backend.service;

import com.salarytracker.backend.model.SalaryRecord;
import com.salarytracker.backend.repository.SalaryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalaryRecordService {

    private final SalaryRecordRepository repository;

    @Autowired
    public SalaryRecordService(SalaryRecordRepository repository) {
        this.repository = repository;
    }

    public List<SalaryRecord> getAllRecords(String userId) {
        return repository.findAllByUserIdOrderByMonthDesc(userId);
    }

    public Optional<SalaryRecord> getRecordById(String userId, String id) {
        return repository.findByIdAndUserId(id, userId);
    }

    public SalaryRecord createRecord(String userId, SalaryRecord record) {
        record.setUserId(userId);
        record.calculateTotals();
        return repository.save(record);
    }

    public SalaryRecord updateRecord(String userId, String id, SalaryRecord recordDetails) {
        return repository.findByIdAndUserId(id, userId).map(record -> {
            record.setMonth(recordDetails.getMonth());
            record.setEmployerName(recordDetails.getEmployerName());
            record.setBaseSalary(recordDetails.getBaseSalary());
            record.setAllowances(recordDetails.getAllowances());
            record.setBonuses(recordDetails.getBonuses());
            record.setDeductions(recordDetails.getDeductions());
            record.setPaymentDate(recordDetails.getPaymentDate());
            record.setStatus(recordDetails.getStatus());
            record.setNotes(recordDetails.getNotes());
            record.setSpendingAllowance(recordDetails.getSpendingAllowance());
            record.calculateTotals();
            return repository.save(record);
        }).orElseThrow(() -> new RuntimeException("Salary record not found with id " + id + " or unauthorized"));
    }

    public void deleteRecord(String userId, String id) {
        SalaryRecord record = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Salary record not found with id " + id + " or unauthorized"));
        repository.delete(record);
    }
}
