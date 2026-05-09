package com.spotmyfy.backend.features.user.dto;

import com.spotmyfy.backend.features.user.domain.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserResponse(
	UUID id,
	String fullName,
	String username,
	String email,
	UserRole role,
	Boolean isActive,
	LocalDateTime createdAt
) {
}
