package com.salarytracker.backend.service;

import com.salarytracker.backend.model.SalaryIncrement;
import com.salarytracker.backend.repository.SalaryIncrementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalaryIncrementService {

    private final SalaryIncrementRepository repository;

    @Autowired
    public SalaryIncrementService(SalaryIncrementRepository repository) {
        this.repository = repository;
    }

    public List<SalaryIncrement> getAllIncrements(String userId) {
        return repository.findAllByUserIdOrderByEffectiveDateDesc(userId);
    }

    public Optional<SalaryIncrement> getIncrementById(String userId, String id) {
        return repository.findByIdAndUserId(id, userId);
    }

    public SalaryIncrement createIncrement(String userId, SalaryIncrement increment) {
        increment.setUserId(userId);
        increment.calculatePercentage();
        return repository.save(increment);
    }

    public SalaryIncrement updateIncrement(String userId, String id, SalaryIncrement incrementDetails) {
        return repository.findByIdAndUserId(id, userId).map(increment -> {
            increment.setEffectiveDate(incrementDetails.getEffectiveDate());
            increment.setEmployerName(incrementDetails.getEmployerName());
            increment.setPreviousBaseSalary(incrementDetails.getPreviousBaseSalary());
            increment.setNewBaseSalary(incrementDetails.getNewBaseSalary());
            increment.setReason(incrementDetails.getReason());
            increment.calculatePercentage();
            return repository.save(increment);
        }).orElseThrow(() -> new RuntimeException("Increment not found with id " + id + " or unauthorized"));
    }

    public void deleteIncrement(String userId, String id) {
        SalaryIncrement increment = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Increment not found with id " + id + " or unauthorized"));
        repository.delete(increment);
    }
}
