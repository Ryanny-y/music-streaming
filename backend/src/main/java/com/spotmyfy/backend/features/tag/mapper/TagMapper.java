package com.spotmyfy.backend.features.tag.mapper;

import com.spotmyfy.backend.features.tag.domain.Tag;
import com.spotmyfy.backend.features.tag.dto.TagResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper {

	TagResponse toResponse(Tag tag);
}
