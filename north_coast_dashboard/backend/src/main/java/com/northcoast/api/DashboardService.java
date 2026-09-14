package com.northcoast.api;

import com.northcoast.api.Models.DashboardSummary;
import com.northcoast.api.Models.Job;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
  private final JobRepository repository;
  private final SummaryNarrator narrator;
  private final Clock clock;

  public DashboardService(JobRepository repository, SummaryNarrator narrator, Clock clock) {
    this.repository = repository;
    this.narrator = narrator;
    this.clock = clock;
  }

  public DashboardSummary summary() {
    List<Job> jobs = repository.findAll();
    LocalDate today = LocalDate.now(clock);
    WeeklyMetrics metrics = metrics(jobs, today);
    Map<String, Integer> statusCounts = new LinkedHashMap<>();
    for (String status : List.of("scheduled", "in-progress", "completed", "cancelled")) {
      statusCounts.put(status, countStatus(jobs, status));
    }
    return new DashboardSummary(today, metrics.weekStart(), metrics.weekEnd(), metrics.todayJobs(),
        metrics.completedRevenue(), metrics.completionRate(), jobs.size(), metrics.weekJobs(),
        metrics.completedJobs(), statusCounts, narrator.summarize(metrics));
  }

  static WeeklyMetrics metrics(List<Job> jobs, LocalDate today) {
    LocalDate start = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDate end = start.plusDays(6);
    List<Job> week = jobs.stream().filter(job -> !job.scheduledDate().isBefore(start)
        && !job.scheduledDate().isAfter(end)).toList();
    int completed = countStatus(week, "completed");
    int cancelled = countStatus(week, "cancelled");
    int active = week.size() - cancelled;
    int completionRate = active == 0 ? 0 : (int) Math.round(100.0 * completed / active);
    BigDecimal revenue = week.stream().filter(job -> "completed".equals(job.status()))
        .map(Job::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
    int todayJobs = (int) jobs.stream().filter(job -> today.equals(job.scheduledDate())
        && !"cancelled".equals(job.status())).count();
    return new WeeklyMetrics(today, start, end, todayJobs, week.size(), completed,
        countStatus(week, "scheduled"), countStatus(week, "in-progress"), cancelled, revenue, completionRate);
  }

  private static int countStatus(List<Job> jobs, String status) {
    return (int) jobs.stream().filter(job -> status.equals(job.status())).count();
  }
}
