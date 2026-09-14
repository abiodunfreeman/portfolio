package com.northcoast.api;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
  private final String[] allowedOrigins;

  public WebConfiguration(@Value("${app.cors.allowed-origins}") String origins) {
    allowedOrigins = Arrays.stream(origins.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isBlank())
        .toArray(String[]::new);
    if (Arrays.stream(allowedOrigins).anyMatch(origin -> origin.contains("*"))) {
      throw new IllegalArgumentException("CORS_ALLOWED_ORIGINS must contain explicit frontend origins.");
    }
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins(allowedOrigins)
        .allowedMethods("GET", "POST", "PUT", "OPTIONS")
        .allowedHeaders("Content-Type", "Accept")
        .exposedHeaders("Location")
        .allowCredentials(false)
        .maxAge(3600);
  }
}
