package com.spotmyfy.backend.features.admin.dto;

import com.spotmyfy.backend.features.song.dto.SongResponse;
import java.util.List;

public record AdminDashboardResponse(
	long totalUsers,
	long activeUsers,
	long totalSongs,
	long publishedSongs,
	long totalCategories,
	long totalTags,
	List<SongResponse> mostPlayedSongs,
	List<SongResponse> recentlyUploadedSongs
) {
}
