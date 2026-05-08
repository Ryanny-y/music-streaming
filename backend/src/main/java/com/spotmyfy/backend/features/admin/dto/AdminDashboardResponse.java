package com.spotmyfy.backend.features.admin.dto;

public record AdminDashboardResponse(
	long totalUsers,
	long activeUsers,
	long totalSongs,
	long publishedSongs,
	long totalCategories,
	long totalTags
) {
}
