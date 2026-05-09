package com.spotmyfy.backend.features.history.dto;

import com.spotmyfy.backend.features.song.dto.SongResponse;
import java.time.LocalDateTime;
import java.util.UUID;

public record ListeningHistoryResponse(
	UUID id,
	SongResponse song,
	LocalDateTime playedAt
) {
}
