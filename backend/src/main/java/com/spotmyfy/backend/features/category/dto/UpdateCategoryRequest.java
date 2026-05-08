package com.spotmyfy.backend.features.category.dto;

import jakarta.validation.constraints.Size;

public record UpdateCategoryRequest(
	@Size(max = 100)
	String name,

	String description
) {
}
