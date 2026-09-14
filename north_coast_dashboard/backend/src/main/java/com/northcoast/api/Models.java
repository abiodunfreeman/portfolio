package com.northcoast.api;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

public final class Models {
  private Models() {}

  public record Customer(
      long id, String name, String phone, String email, String address, String suburb) {}

  public record Technician(
      long id, String name, String initials, String specialty, String color) {}

  public record Job(
      long id,
      String reference,
      String title,
      String description,
      String serviceType,
      String status,
      LocalDate scheduledDate,
      @JsonFormat(pattern = "HH:mm") LocalTime scheduledTime,
      int durationMinutes,
      BigDecimal amount,
      Customer customer,
      Technician technician,
      Instant createdAt,
      Instant updatedAt) {}

  public record WeekSummary(String text, String mode, Instant generatedAt) {}

  public record DashboardSummary(
      LocalDate today,
      LocalDate weekStart,
      LocalDate weekEnd,
      int todayJobs,
      BigDecimal weeklyRevenue,
      int completionRate,
      int totalJobs,
      int weekJobs,
      int weekCompletedJobs,
      Map<String, Integer> jobsByStatus,
      WeekSummary aiWeekSummary) {}
}
