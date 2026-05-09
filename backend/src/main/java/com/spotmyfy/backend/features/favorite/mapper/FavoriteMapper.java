package com.spotmyfy.backend.features.favorite.mapper;

import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.favorite.dto.FavoriteResponse;
import com.spotmyfy.backend.features.song.mapper.SongMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = SongMapper.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FavoriteMapper {

	@Mapping(target = "id", source = "favoriteId")
	@Mapping(target = "song", source = "song")
	FavoriteResponse toResponse(Favorite favorite);
}
