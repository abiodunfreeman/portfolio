package com.northcoast.api;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record JobInput(
    @NotBlank @Size(max = 120) String title,
    @NotNull @Size(max = 2000) String description,
    @NotBlank @Pattern(regexp = "ac-repair|furnace-installation|maintenance|heat-pump|thermostat|diagnostic")
        String serviceType,
    @NotBlank @Pattern(regexp = "scheduled|in-progress|completed|cancelled") String status,
    @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "must use YYYY-MM-DD")
        String scheduledDate,
    @NotBlank @Pattern(regexp = "([01]\\d|2[0-3]):[0-5]\\d", message = "must use HH:mm (24-hour time)")
        String scheduledTime,
    @NotNull @Min(15) @Max(480) Integer durationMinutes,
    @NotNull @DecimalMin("0.00") @DecimalMax("100000.00") @Digits(integer = 6, fraction = 2)
        BigDecimal amount,
    @NotNull @Positive Long customerId,
    @NotNull @Positive Long technicianId) {}
