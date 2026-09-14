package com.northcoast.api;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class ApiExceptionHandler {
  record ErrorResponse(String message, Map<String, String> errors) {}

  @ExceptionHandler(ApiException.class)
  ResponseEntity<ErrorResponse> apiError(ApiException exception) {
    return ResponseEntity.status(exception.status())
        .body(new ErrorResponse(exception.getMessage(), exception.errors()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ErrorResponse> invalidFields(MethodArgumentNotValidException exception) {
    Map<String, String> fields = new LinkedHashMap<>();
    exception.getBindingResult().getFieldErrors()
        .forEach(error -> fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
    return ResponseEntity.badRequest()
        .body(new ErrorResponse("Please check the highlighted job details.", fields));
  }

  @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
  ResponseEntity<ErrorResponse> invalidJson(Exception exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse("The request contains invalid JSON or a value in the wrong format.", Map.of()));
  }
}
