package com.spotmyfy.backend.features.user.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
	@NotNull
	Boolean active
) {
}
