package com.spotmyfy.backend.features.category.dto;

import java.util.UUID;

public record CategoryResponse(
	UUID id,
	String name,
	String description,
	int songCount
) {
}
