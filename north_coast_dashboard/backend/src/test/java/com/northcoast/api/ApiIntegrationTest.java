package com.northcoast.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = {"app.openai.api-key=", "spring.datasource.url=jdbc:h2:mem:northcoast-test;DB_CLOSE_DELAY=-1"})
@AutoConfigureMockMvc
@Transactional
class ApiIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper mapper;
  @Autowired JdbcTemplate jdbc;

  @Test
  void seedContainsAllRequiredRecordsAndStableJobShape() throws Exception {
    mvc.perform(get("/api/customers")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(12)));
    mvc.perform(get("/api/technicians")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(4)));
    mvc.perform(get("/api/jobs")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(15)));
    mvc.perform(get("/api/jobs/1")).andExpect(status().isOk())
        .andExpect(jsonPath("$.reference").value("NC-1001"))
        .andExpect(jsonPath("$.status").value("in-progress"))
        .andExpect(jsonPath("$.scheduledTime").value("09:00"))
        .andExpect(jsonPath("$.customer.suburb").value("Lakewood"))
        .andExpect(jsonPath("$.technician.initials").value("MS"));
  }

  @Test
  void createThenReadAndUpdatePersistsWithoutOverwritingExistingRecords() throws Exception {
    Map<String, Object> payload = validInput();
    String body = mvc.perform(post("/api/jobs").contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(payload)))
        .andExpect(status().isCreated()).andExpect(header().exists("Location"))
        .andExpect(jsonPath("$.title").value("Replace thermostat"))
        .andReturn().getResponse().getContentAsString();
    long id = mapper.readTree(body).path("id").asLong();
    assertThat(id).isGreaterThan(15);
    payload.put("status", "completed");
    payload.put("amount", new BigDecimal("325.50"));
    mvc.perform(put("/api/jobs/" + id).contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(payload)))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("completed"));
    mvc.perform(get("/api/jobs/" + id)).andExpect(jsonPath("$.amount").value(325.5));
    assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class)).isEqualTo(16);
  }

  @Test
  void rejectsInvalidFieldsAndUnknownRelatedRecordsWithoutWriting() throws Exception {
    Map<String, Object> payload = validInput();
    payload.put("title", " ");
    payload.put("status", "paid");
    payload.put("amount", -12);
    payload.put("scheduledTime", "25:30");
    mvc.perform(post("/api/jobs").contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.title").exists())
        .andExpect(jsonPath("$.errors.status").exists())
        .andExpect(jsonPath("$.errors.scheduledTime").exists());
    payload = validInput();
    payload.put("customerId", 999);
    mvc.perform(post("/api/jobs").contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.customerId").exists());
    payload = validInput();
    payload.put("technicianId", 999);
    mvc.perform(post("/api/jobs").contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.technicianId").exists());
    assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class)).isEqualTo(15);
  }

  @Test
  void invalidCalendarDatesMalformedJsonAndMissingJobsHaveUsefulErrors() throws Exception {
    Map<String, Object> payload = validInput();
    payload.put("scheduledDate", "2026-02-30");
    mvc.perform(post("/api/jobs").contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(payload)))
        .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.scheduledDate").exists());
    mvc.perform(post("/api/jobs").contentType(MediaType.APPLICATION_JSON).content("{bad json"))
        .andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").isString());
    mvc.perform(get("/api/jobs/99999")).andExpect(status().isNotFound());
    mvc.perform(put("/api/jobs/99999").contentType(MediaType.APPLICATION_JSON)
        .content(mapper.writeValueAsString(validInput()))).andExpect(status().isNotFound());
  }

  @Test
  void summaryUsesClevelandDatesAndCompletedJobRevenue() throws Exception {
    JsonNode summary = mapper.readTree(mvc.perform(get("/api/dashboard/summary"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.totalJobs").value(15))
        .andExpect(jsonPath("$.jobsByStatus.scheduled").value(6))
        .andExpect(jsonPath("$.jobsByStatus['in-progress']").value(2))
        .andExpect(jsonPath("$.jobsByStatus.completed").value(5))
        .andExpect(jsonPath("$.jobsByStatus.cancelled").value(2))
        .andExpect(jsonPath("$.aiWeekSummary.mode").value("rules"))
        .andReturn().getResponse().getContentAsString());
    LocalDate today = LocalDate.now(NorthCoastApplication.CLEVELAND);
    assertThat(summary.path("today").asText()).isEqualTo(today.toString());
    assertThat(summary.path("weeklyRevenue").decimalValue()).isEqualByComparingTo("6489.00");
    int todayCount = jdbc.queryForObject(
        "SELECT COUNT(*) FROM jobs WHERE scheduled_date = ? AND status <> 'cancelled'", Integer.class, today);
    assertThat(summary.path("todayJobs").asInt()).isEqualTo(todayCount);
  }

  @Test
  void corsAllowsConfiguredFrontendButRejectsUnknownOrigins() throws Exception {
    mvc.perform(options("/api/jobs").header("Origin", "http://localhost:5175")
            .header("Access-Control-Request-Method", "PUT")
            .header("Access-Control-Request-Headers", "content-type"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5175"));
    mvc.perform(options("/api/jobs").header("Origin", "https://unconfigured.example")
            .header("Access-Control-Request-Method", "PUT"))
        .andExpect(status().isForbidden());
  }

  private Map<String, Object> validInput() {
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("title", "Replace thermostat");
    payload.put("description", "Install and test the approved thermostat.");
    payload.put("serviceType", "thermostat");
    payload.put("status", "scheduled");
    payload.put("scheduledDate", "2026-09-16");
    payload.put("scheduledTime", "10:30");
    payload.put("durationMinutes", 60);
    payload.put("amount", new BigDecimal("295.00"));
    payload.put("customerId", 1);
    payload.put("technicianId", 4);
    return payload;
  }
}
