package com.spotmyfy.backend.features.user.dto;

import com.spotmyfy.backend.features.user.domain.UserRole;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
	@NotNull
	UserRole role
) {
}
