package com.northcoast.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class SummaryNarratorTest {
  private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
  private final Clock clock = Clock.fixed(Instant.parse("2026-09-16T15:00:00Z"), NorthCoastApplication.CLEVELAND);

  @Test
  void noKeyReturnsFreshRulesWithoutCallingProvider() {
    HttpClient client = mock(HttpClient.class);
    var narrator = new SummaryNarrator(mapper, clock, "", "gpt-5.6-luna", client);
    assertThat(narrator.summarize(metrics()).mode()).isEqualTo("rules");
    assertThat(narrator.summarize(metrics()).text()).contains("$300.30");
    verifyNoInteractions(client);
  }

  @Test
  @SuppressWarnings("unchecked")
  void validResponsesApiOutputIsExtractedAndCached() throws Exception {
    HttpClient client = mock(HttpClient.class);
    HttpResponse<String> response = mock(HttpResponse.class);
    when(response.statusCode()).thenReturn(200);
    when(response.body()).thenReturn("""
        {"status":"completed","output":[{"type":"reasoning"},{"type":"message","content":[
          {"type":"output_text","text":"Two jobs are complete this week."}]}]}
        """);
    when(client.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class))).thenReturn(response);
    var narrator = new SummaryNarrator(mapper, clock, "fake-test-key", "gpt-5.6-luna", client);
    assertThat(narrator.summarize(metrics()).mode()).isEqualTo("ai");
    assertThat(narrator.summarize(metrics()).text()).isEqualTo("Two jobs are complete this week.");
    verify(client, times(1)).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));
  }

  @Test
  @SuppressWarnings("unchecked")
  void providerFailureFallsBackAndDoesNotRetryImmediately() throws Exception {
    HttpClient client = mock(HttpClient.class);
    when(client.send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class)))
        .thenThrow(new IOException("simulated failure"));
    var narrator = new SummaryNarrator(mapper, clock, "fake-test-key", "gpt-5.6-luna", client);
    assertThat(narrator.summarize(metrics()).mode()).isEqualTo("rules");
    assertThat(narrator.summarize(metrics()).mode()).isEqualTo("rules");
    verify(client, times(1)).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));
  }

  @Test
  void incompleteOrMalformedProviderOutputIsNeverShown() throws Exception {
    assertThat(SummaryNarrator.extractText(mapper.readTree("{\"status\":\"incomplete\",\"output\":[]}"))).isEmpty();
    assertThat(SummaryNarrator.extractText(mapper.readTree("{\"output\":[{\"type\":\"message\",\"content\":[{\"type\":\"refusal\"}]}]}"))).isEmpty();
    assertThat(SummaryNarrator.extractText(mapper.readTree("{}"))).isEmpty();
  }

  private WeeklyMetrics metrics() {
    return new WeeklyMetrics(LocalDate.of(2026, 9, 16), LocalDate.of(2026, 9, 14), LocalDate.of(2026, 9, 20),
        2, 5, 2, 1, 1, 1, new BigDecimal("300.30"), 50);
  }
}
