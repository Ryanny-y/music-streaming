package com.spotmyfy.backend.features.song.dto;

import com.spotmyfy.backend.features.song.domain.SongStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record SongResponse(
	UUID songId,
	String title,
	String artist,
	String album,
	String audioUrl,
	String coverImageUrl,
	String duration,
	LocalDate releaseDate,
	String categoryName,
	Set<String> tagNames,
	SongStatus status,
	Long playCount,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
