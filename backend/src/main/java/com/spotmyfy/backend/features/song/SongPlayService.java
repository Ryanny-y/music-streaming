package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import com.spotmyfy.backend.features.history.dto.ListeningHistoryResponse;
import com.spotmyfy.backend.features.history.mapper.ListeningHistoryMapper;
import com.spotmyfy.backend.features.history.repository.ListeningHistoryRepository;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SongPlayService {

	private final SongRepository songRepository;
	private final UserRepository userRepository;
	private final ListeningHistoryRepository listeningHistoryRepository;
	private final ListeningHistoryMapper listeningHistoryMapper;

	public SongPlayService(
			SongRepository songRepository,
			UserRepository userRepository,
			ListeningHistoryRepository listeningHistoryRepository,
			ListeningHistoryMapper listeningHistoryMapper
	) {
		this.songRepository = songRepository;
		this.userRepository = userRepository;
		this.listeningHistoryRepository = listeningHistoryRepository;
		this.listeningHistoryMapper = listeningHistoryMapper;
	}

	@Transactional
	public ListeningHistoryResponse playSong(UUID userId, UUID songId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		Song song = songRepository.findByIdAndStatus(songId, SongStatus.PUBLISHED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Published song not found"));
		song.setPlayCount((song.getPlayCount() == null ? 0L : song.getPlayCount()) + 1L);
		ListeningHistory history = ListeningHistory.builder()
				.user(user)
				.song(song)
				.build();
		songRepository.save(song);
		return listeningHistoryMapper.toResponse(listeningHistoryRepository.save(history));
	}
}
