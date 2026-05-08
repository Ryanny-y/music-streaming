package com.spotmyfy.backend.features.user.dto;

import com.spotmyfy.backend.features.user.domain.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
	UUID userId,
	String fullName,
	String username,
	String email,
	UserRole role,
	Boolean active,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
