package com.spotmyfy.backend.features.favorite.dto;

import com.spotmyfy.backend.features.song.dto.SongResponse;
import java.time.LocalDateTime;
import java.util.UUID;

public record FavoriteResponse(
	UUID id,
	SongResponse song,
	LocalDateTime createdAt
) {
}
