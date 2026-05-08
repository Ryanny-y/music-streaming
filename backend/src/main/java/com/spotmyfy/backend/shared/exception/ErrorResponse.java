package com.spotmyfy.backend.shared.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
		boolean success,
		String error,
		String message,
		int status,
		String path,
		Map<String, String> validationErrors,
		Instant timestamp
) {

	public static ErrorResponse of(String error, String message, int status, String path) {
		return new ErrorResponse(false, error, message, status, path, null, Instant.now());
	}

	public static ErrorResponse validation(String message, int status, String path, Map<String, String> validationErrors) {
		return new ErrorResponse(false, "Validation failed", message, status, path, validationErrors, Instant.now());
	}
}
