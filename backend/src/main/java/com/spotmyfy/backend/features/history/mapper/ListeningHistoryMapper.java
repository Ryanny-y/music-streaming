package com.spotmyfy.backend.features.history.mapper;

import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import com.spotmyfy.backend.features.history.dto.ListeningHistoryResponse;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ListeningHistoryMapper {

	@Mapping(target = "userId", expression = "java(toUserId(listeningHistory.getUser()))")
	@Mapping(target = "songId", expression = "java(toSongId(listeningHistory.getSong()))")
	@Mapping(target = "songTitle", expression = "java(toSongTitle(listeningHistory.getSong()))")
	@Mapping(target = "songArtist", expression = "java(toSongArtist(listeningHistory.getSong()))")
	@Mapping(target = "coverImageUrl", expression = "java(toCoverImageUrl(listeningHistory.getSong()))")
	ListeningHistoryResponse toResponse(ListeningHistory listeningHistory);

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
