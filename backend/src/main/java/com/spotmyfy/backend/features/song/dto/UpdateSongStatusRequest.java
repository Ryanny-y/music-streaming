package com.spotmyfy.backend.features.song.dto;

import com.spotmyfy.backend.features.song.domain.SongStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateSongStatusRequest(
	@NotNull
	SongStatus status
) {
}
