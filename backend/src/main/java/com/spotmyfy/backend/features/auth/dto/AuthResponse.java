package com.spotmyfy.backend.features.auth.dto;

import com.spotmyfy.backend.features.user.dto.UserResponse;

public record AuthResponse(
	String accessToken,
	String refreshToken,
	String tokenType,
	long expiresInMinutes,
	UserResponse user
) {
}
