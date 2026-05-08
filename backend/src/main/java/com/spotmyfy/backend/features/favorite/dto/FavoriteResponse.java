package com.spotmyfy.backend.features.favorite.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record FavoriteResponse(
	UUID favoriteId,
	UUID userId,
	UUID songId,
	String songTitle,
	String songArtist,
	String coverImageUrl,
	LocalDateTime createdAt
) {
}
