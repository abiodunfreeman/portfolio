package com.northcoast.api;

import com.northcoast.api.Models.DashboardSummary;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {
  private final DashboardService service;

  public DashboardController(DashboardService service) {
    this.service = service;
  }

  @GetMapping("/api/dashboard/summary")
  DashboardSummary summary() {
    return service.summary();
  }
}
