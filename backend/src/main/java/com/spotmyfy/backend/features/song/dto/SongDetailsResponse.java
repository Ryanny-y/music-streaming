package com.spotmyfy.backend.features.song.dto;

import com.spotmyfy.backend.features.song.domain.SongStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record SongDetailsResponse(
	UUID id,
	String title,
	String artist,
	String album,
	String description,
	String lyrics,
	String audioUrl,
	String coverImageUrl,
	String duration,
	LocalDate releaseDate,
	UUID categoryId,
	String categoryName,
	Set<String> tags,
	SongStatus status,
	Long playCount,
	LocalDateTime createdAt
) {
}
