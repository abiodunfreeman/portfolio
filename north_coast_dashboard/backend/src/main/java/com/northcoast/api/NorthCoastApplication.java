package com.northcoast.api;

import java.time.Clock;
import java.time.ZoneId;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class NorthCoastApplication {
  public static final ZoneId CLEVELAND = ZoneId.of("America/New_York");

  public static void main(String[] args) {
    SpringApplication.run(NorthCoastApplication.class, args);
  }

  @Bean
  Clock businessClock() {
    return Clock.system(CLEVELAND);
  }
}
