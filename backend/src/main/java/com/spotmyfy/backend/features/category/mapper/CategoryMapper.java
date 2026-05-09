package com.spotmyfy.backend.features.category.mapper;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.category.dto.CategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

	@Mapping(target = "id", source = "categoryId")
	@Mapping(target = "songCount", expression = "java(toSongCount(category))")
	CategoryResponse toResponse(Category category);

	default int toSongCount(Category category) {
		return category == null || category.getSongs() == null ? 0 : category.getSongs().size();
	}
}
