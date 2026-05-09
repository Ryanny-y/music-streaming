package com.spotmyfy.backend.features.tag.mapper;

import com.spotmyfy.backend.features.tag.domain.Tag;
import com.spotmyfy.backend.features.tag.dto.TagResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper {

	@Mapping(target = "id", source = "tagId")
	@Mapping(target = "songCount", expression = "java(toSongCount(tag))")
	TagResponse toResponse(Tag tag);

	default int toSongCount(Tag tag) {
		return tag == null || tag.getSongs() == null ? 0 : tag.getSongs().size();
	}
}
