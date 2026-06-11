package com.salarytracker.backend.controller;

import com.salarytracker.backend.dto.DashboardStatsDto;
import com.salarytracker.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    @Autowired
    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    public DashboardStatsDto getStats() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.getDashboardStats(userId);
    }
}
