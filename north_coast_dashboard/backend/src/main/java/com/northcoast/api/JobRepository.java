package com.northcoast.api;

import com.northcoast.api.Models.Customer;
import com.northcoast.api.Models.Job;
import com.northcoast.api.Models.Technician;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class JobRepository {
  private static final String JOB_SELECT = """
      SELECT j.*, c.name AS customer_name, c.phone, c.email, c.address, c.suburb,
        t.name AS technician_name, t.initials, t.specialty, t.color
      FROM jobs j JOIN customers c ON c.id = j.customer_id
        JOIN technicians t ON t.id = j.technician_id
      """;

  private final JdbcTemplate jdbc;

  public JobRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  public List<Job> findAll() {
    return jdbc.query(JOB_SELECT + " ORDER BY j.scheduled_date, j.scheduled_time, j.id", this::mapJob);
  }

  public Job findById(long id) {
    return jdbc.query(JOB_SELECT + " WHERE j.id = ?", this::mapJob, id).stream()
        .findFirst().orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "This job was not found."));
  }

  public List<Customer> customers() {
    return jdbc.query("SELECT * FROM customers ORDER BY name", (rs, row) -> new Customer(
        rs.getLong("id"), rs.getString("name"), rs.getString("phone"), rs.getString("email"),
        rs.getString("address"), rs.getString("suburb")));
  }

  public List<Technician> technicians() {
    return jdbc.query("SELECT * FROM technicians ORDER BY id", (rs, row) -> new Technician(
        rs.getLong("id"), rs.getString("name"), rs.getString("initials"),
        rs.getString("specialty"), rs.getString("color")));
  }

  @Transactional
  public Job create(JobInput input, LocalDate date, LocalTime time) {
    validateReferences(input);
    GeneratedKeyHolder key = new GeneratedKeyHolder();
    jdbc.update(connection -> {
      var statement = connection.prepareStatement("""
          INSERT INTO jobs (title, description, service_type, status, scheduled_date,
            scheduled_time, duration_minutes, amount, customer_id, technician_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          """, new String[] {"id"});
      statement.setString(1, input.title().trim());
      statement.setString(2, input.description().trim());
      statement.setString(3, input.serviceType());
      statement.setString(4, input.status());
      statement.setObject(5, date);
      statement.setObject(6, time);
      statement.setInt(7, input.durationMinutes());
      statement.setBigDecimal(8, input.amount());
      statement.setLong(9, input.customerId());
      statement.setLong(10, input.technicianId());
      return statement;
    }, key);
    Number createdId = key.getKey();
    if (createdId == null) {
      throw new IllegalStateException("The database did not return a job identifier.");
    }
    return findById(createdId.longValue());
  }

  @Transactional
  public Job update(long id, JobInput input, LocalDate date, LocalTime time) {
    findById(id);
    validateReferences(input);
    jdbc.update("""
        UPDATE jobs SET title = ?, description = ?, service_type = ?, status = ?,
          scheduled_date = ?, scheduled_time = ?, duration_minutes = ?, amount = ?,
          customer_id = ?, technician_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        """, input.title().trim(), input.description().trim(), input.serviceType(), input.status(),
        date, time, input.durationMinutes(), input.amount(), input.customerId(), input.technicianId(), id);
    return findById(id);
  }

  private void validateReferences(JobInput input) {
    if (jdbc.queryForObject("SELECT COUNT(*) FROM customers WHERE id = ?", Integer.class, input.customerId()) == 0) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Choose an existing customer.",
          java.util.Map.of("customerId", "Customer does not exist."));
    }
    if (jdbc.queryForObject("SELECT COUNT(*) FROM technicians WHERE id = ?", Integer.class, input.technicianId()) == 0) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Choose an existing technician.",
          java.util.Map.of("technicianId", "Technician does not exist."));
    }
  }

  private Job mapJob(ResultSet rs, int row) throws SQLException {
    Customer customer = new Customer(rs.getLong("customer_id"), rs.getString("customer_name"),
        rs.getString("phone"), rs.getString("email"), rs.getString("address"), rs.getString("suburb"));
    Technician technician = new Technician(rs.getLong("technician_id"), rs.getString("technician_name"),
        rs.getString("initials"), rs.getString("specialty"), rs.getString("color"));
    long id = rs.getLong("id");
    return new Job(id, "NC-" + String.format("%04d", 1000 + id), rs.getString("title"),
        rs.getString("description"), rs.getString("service_type"), rs.getString("status"),
        rs.getObject("scheduled_date", LocalDate.class), rs.getObject("scheduled_time", LocalTime.class),
        rs.getInt("duration_minutes"), rs.getBigDecimal("amount"), customer, technician,
        rs.getObject("created_at", OffsetDateTime.class).toInstant(),
        rs.getObject("updated_at", OffsetDateTime.class).toInstant());
  }
}
