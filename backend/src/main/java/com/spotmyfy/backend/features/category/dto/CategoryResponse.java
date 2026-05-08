package com.spotmyfy.backend.features.category.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CategoryResponse(
	UUID categoryId,
	String name,
	String description,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {
}
