package com.spotmyfy.backend.features.song.dto;

import com.spotmyfy.backend.features.song.domain.SongStatus;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record UpdateSongRequest(
	@Size(max = 150)
	String title,

	@Size(max = 150)
	String artist,

	@Size(max = 150)
	String album,

	String description,
	String lyrics,
	String audioUrl,
	String coverImageUrl,

	@Size(max = 20)
	String duration,

	LocalDate releaseDate,
	UUID categoryId,
	Set<UUID> tagIds,
	SongStatus status
) {
}
