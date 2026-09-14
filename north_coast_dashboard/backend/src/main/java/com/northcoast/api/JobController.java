package com.northcoast.api;

import com.northcoast.api.Models.Customer;
import com.northcoast.api.Models.Job;
import com.northcoast.api.Models.Technician;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class JobController {
  private final JobRepository repository;

  public JobController(JobRepository repository) {
    this.repository = repository;
  }

  @GetMapping("/jobs")
  List<Job> jobs() {
    return repository.findAll();
  }

  @GetMapping("/jobs/{id}")
  Job job(@PathVariable long id) {
    return repository.findById(id);
  }

  @PostMapping("/jobs")
  ResponseEntity<Job> create(@Valid @RequestBody JobInput input) {
    Job created = repository.create(input, parseDate(input.scheduledDate()), LocalTime.parse(input.scheduledTime()));
    return ResponseEntity.created(URI.create("/api/jobs/" + created.id())).body(created);
  }

  @PutMapping("/jobs/{id}")
  Job update(@PathVariable long id, @Valid @RequestBody JobInput input) {
    return repository.update(id, input, parseDate(input.scheduledDate()), LocalTime.parse(input.scheduledTime()));
  }

  @GetMapping("/customers")
  List<Customer> customers() {
    return repository.customers();
  }

  @GetMapping("/technicians")
  List<Technician> technicians() {
    return repository.technicians();
  }

  @GetMapping("/health")
  Map<String, String> health() {
    return Map.of("status", "ok", "application", "north-coast-api", "storage", "in-memory-demo");
  }

  private LocalDate parseDate(String value) {
    try {
      LocalDate date = LocalDate.parse(value);
      if (date.getYear() < 2000 || date.getYear() > 2100) {
        throw new DateTimeParseException("Date out of range", value, 0);
      }
      return date;
    } catch (DateTimeParseException exception) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid date between 2000 and 2100.",
          Map.of("scheduledDate", "Use a real calendar date between 2000 and 2100."));
    }
  }
}
