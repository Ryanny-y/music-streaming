package com.spotmyfy.backend.features.tag.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TagResponse(
	UUID tagId,
	String name,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
