package com.spotmyfy.backend.features.tag.dto;

import java.util.UUID;

public record TagResponse(
	UUID id,
	String name,
	int songCount
) {
}
