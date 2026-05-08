package com.spotmyfy.backend.features.tag.dto;

import jakarta.validation.constraints.Size;

public record UpdateTagRequest(
	@Size(max = 100)
	String name
) {
}
