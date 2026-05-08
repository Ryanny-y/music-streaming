package com.spotmyfy.backend.features.favorite;

import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.favorite.dto.FavoriteResponse;
import com.spotmyfy.backend.features.favorite.mapper.FavoriteMapper;
import com.spotmyfy.backend.features.favorite.repository.FavoriteRepository;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FavoriteService {

	private final FavoriteRepository favoriteRepository;
	private final UserRepository userRepository;
	private final SongRepository songRepository;
	private final FavoriteMapper favoriteMapper;

	public FavoriteService(
			FavoriteRepository favoriteRepository,
			UserRepository userRepository,
			SongRepository songRepository,
			FavoriteMapper favoriteMapper
	) {
		this.favoriteRepository = favoriteRepository;
		this.userRepository = userRepository;
		this.songRepository = songRepository;
		this.favoriteMapper = favoriteMapper;
	}

	@Transactional(readOnly = true)
	public Page<FavoriteResponse> findFavorites(UUID userId, Pageable pageable) {
		User user = findCurrentUser(userId);
		return favoriteRepository.findByUser(user, pageable)
				.map(favoriteMapper::toResponse);
	}

	@Transactional
	public FavoriteResponse addFavorite(UUID userId, UUID songId) {
		User user = findCurrentUser(userId);
		Song song = findPublishedSong(songId);
		if (favoriteRepository.existsByUserAndSong(user, song)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Song is already in favorites");
		}
		Favorite favorite = Favorite.builder()
				.user(user)
				.song(song)
				.build();
		return favoriteMapper.toResponse(favoriteRepository.save(favorite));
	}

	@Transactional
	public void removeFavorite(UUID userId, UUID songId) {
		User user = findCurrentUser(userId);
		favoriteRepository.deleteByUserAndSongId(user, songId);
	}

	private User findCurrentUser(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

	private Song findPublishedSong(UUID songId) {
		return songRepository.findByIdAndStatus(songId, SongStatus.PUBLISHED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Published song not found"));
	}
}
