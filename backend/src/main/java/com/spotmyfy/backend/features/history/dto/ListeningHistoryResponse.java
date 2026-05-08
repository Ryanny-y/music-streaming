package com.spotmyfy.backend.features.history.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ListeningHistoryResponse(
	UUID historyId,
	UUID userId,
	UUID songId,
	String songTitle,
	String songArtist,
	String coverImageUrl,
	LocalDateTime playedAt
) {
}
