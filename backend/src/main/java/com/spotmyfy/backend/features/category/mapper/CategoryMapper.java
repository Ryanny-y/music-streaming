package com.spotmyfy.backend.features.category.mapper;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.category.dto.CategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

	CategoryResponse toResponse(Category category);
}
