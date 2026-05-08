package com.spotmyfy.backend.features.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
	@NotBlank
	@Size(max = 150)
	String fullName,

	@NotBlank
	@Size(min = 3, max = 80)
	String username,

	@NotBlank
	@Email
	@Size(max = 150)
	String email,

	@NotBlank
	@Size(min = 8, max = 100)
	String password
) {
}
