package com.spotmyfy.backend.features.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
	@NotBlank
	@Size(max = 150)
	String fullName,

	@NotBlank
	@Size(min = 3, max = 80)
	String username,

	@NotBlank
	@Email
	@Size(max = 150)
	String email
) {
}
