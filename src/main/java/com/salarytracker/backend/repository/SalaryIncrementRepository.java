package com.salarytracker.backend.repository;

import com.salarytracker.backend.model.SalaryIncrement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryIncrementRepository extends MongoRepository<SalaryIncrement, String> {
    List<SalaryIncrement> findAllByUserIdOrderByEffectiveDateDesc(String userId);
    Optional<SalaryIncrement> findByIdAndUserId(String id, String userId);
}
