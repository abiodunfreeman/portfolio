package com.northcoast.api;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Only aggregate values may be sent to the optional AI provider. */
public record WeeklyMetrics(
    LocalDate today,
    LocalDate weekStart,
    LocalDate weekEnd,
    int todayJobs,
    int weekJobs,
    int completedJobs,
    int scheduledJobs,
    int inProgressJobs,
    int cancelledJobs,
    BigDecimal completedRevenue,
    int completionRate) {}
