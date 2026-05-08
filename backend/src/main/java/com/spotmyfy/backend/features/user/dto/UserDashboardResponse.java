package com.spotmyfy.backend.features.user.dto;

public record UserDashboardResponse(
	long totalFavorites,
	long totalPlayedSongs,
	long totalListeningHistory
) {
}
