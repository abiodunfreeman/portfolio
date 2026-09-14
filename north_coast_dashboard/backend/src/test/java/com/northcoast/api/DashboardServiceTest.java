package com.northcoast.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.northcoast.api.Models.Job;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class DashboardServiceTest {
  @Test
  void weekIsMondayThroughSundayAndExcludesCancelledFromCompletionAndToday() {
    LocalDate today = LocalDate.of(2026, 9, 16);
    List<Job> jobs = List.of(
        job(1, "completed", "2026-09-14", "100.10"),
        job(2, "completed", "2026-09-20", "200.20"),
        job(3, "scheduled", "2026-09-16", "9000.00"),
        job(4, "in-progress", "2026-09-16", "5000.00"),
        job(5, "cancelled", "2026-09-16", "1000.00"),
        job(6, "completed", "2026-09-13", "800.00"),
        job(7, "completed", "2026-09-21", "600.00"));
    WeeklyMetrics result = DashboardService.metrics(jobs, today);
    assertThat(result.weekStart()).isEqualTo(LocalDate.of(2026, 9, 14));
    assertThat(result.weekEnd()).isEqualTo(LocalDate.of(2026, 9, 20));
    assertThat(result.weekJobs()).isEqualTo(5);
    assertThat(result.completedJobs()).isEqualTo(2);
    assertThat(result.todayJobs()).isEqualTo(2);
    assertThat(result.completionRate()).isEqualTo(50);
    assertThat(result.completedRevenue()).isEqualByComparingTo("300.30");
  }

  @Test
  void emptyAndAllCancelledWeeksHaveZeroCompletionWithoutDivisionErrors() {
    LocalDate today = LocalDate.of(2026, 9, 14);
    assertThat(DashboardService.metrics(List.of(), today).completionRate()).isZero();
    WeeklyMetrics result = DashboardService.metrics(List.of(job(1, "cancelled", "2026-09-14", "199.00")), today);
    assertThat(result.completionRate()).isZero();
    assertThat(result.completedRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
    assertThat(result.todayJobs()).isZero();
    assertThat(SummaryNarrator.ruleSummary(result)).contains("0 of 0 non-cancelled jobs");
  }

  private Job job(long id, String status, String date, String amount) {
    return new Job(id, "NC-" + id, "Sample service", "", "maintenance", status,
        LocalDate.parse(date), LocalTime.of(9, 0), 60, new BigDecimal(amount), null, null,
        Instant.EPOCH, Instant.EPOCH);
  }
}
