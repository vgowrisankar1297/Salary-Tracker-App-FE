package com.salarytracker.backend.repository;

import com.salarytracker.backend.model.SalaryRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRecordRepository extends MongoRepository<SalaryRecord, String> {
    List<SalaryRecord> findAllByUserIdOrderByMonthDesc(String userId);
    List<SalaryRecord> findByUserIdAndEmployerNameIgnoreCase(String userId, String employerName);
    Optional<SalaryRecord> findByIdAndUserId(String id, String userId);
}
