package com.spotmyfy.backend.features.song.mapper;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.dto.SongDetailsResponse;
import com.spotmyfy.backend.features.song.dto.SongResponse;
import com.spotmyfy.backend.features.tag.domain.Tag;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SongMapper {

	@Mapping(target = "categoryName", expression = "java(toCategoryName(song.getCategory()))")
	@Mapping(target = "tagNames", expression = "java(toTagNames(song.getTags()))")
	SongResponse toResponse(Song song);

	@Mapping(target = "categoryId", expression = "java(toCategoryId(song.getCategory()))")
	@Mapping(target = "categoryName", expression = "java(toCategoryName(song.getCategory()))")
	@Mapping(target = "tagNames", expression = "java(toTagNames(song.getTags()))")
	SongDetailsResponse toDetailsResponse(Song song);

	default UUID toCategoryId(Category category) {
		return category == null ? null : category.getCategoryId();
	}

	default String toCategoryName(Category category) {
		return category == null ? null : category.getName();
	}

	default Set<String> toTagNames(Set<Tag> tags) {
		if (tags == null || tags.isEmpty()) {
			return Collections.emptySet();
		}
		return tags.stream()
			.map(Tag::getName)
			.collect(Collectors.toUnmodifiableSet());
	}
}
