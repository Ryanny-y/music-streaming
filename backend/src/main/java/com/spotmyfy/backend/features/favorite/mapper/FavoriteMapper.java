package com.spotmyfy.backend.features.favorite.mapper;

import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.favorite.dto.FavoriteResponse;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FavoriteMapper {

	@Mapping(target = "userId", expression = "java(toUserId(favorite.getUser()))")
	@Mapping(target = "songId", expression = "java(toSongId(favorite.getSong()))")
	@Mapping(target = "songTitle", expression = "java(toSongTitle(favorite.getSong()))")
	@Mapping(target = "songArtist", expression = "java(toSongArtist(favorite.getSong()))")
	@Mapping(target = "coverImageUrl", expression = "java(toCoverImageUrl(favorite.getSong()))")
	FavoriteResponse toResponse(Favorite favorite);

	default UUID toUserId(User user) {
		return user == null ? null : user.getUserId();
	}

	default UUID toSongId(Song song) {
		return song == null ? null : song.getSongId();
	}

	default String toSongTitle(Song song) {
		return song == null ? null : song.getTitle();
	}

	default String toSongArtist(Song song) {
		return song == null ? null : song.getArtist();
	}

	default String toCoverImageUrl(Song song) {
		return song == null ? null : song.getCoverImageUrl();
	}
}
