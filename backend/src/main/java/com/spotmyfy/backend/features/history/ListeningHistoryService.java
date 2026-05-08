package com.spotmyfy.backend.features.history;

import com.spotmyfy.backend.features.history.dto.ListeningHistoryResponse;
import com.spotmyfy.backend.features.history.mapper.ListeningHistoryMapper;
import com.spotmyfy.backend.features.history.repository.ListeningHistoryRepository;
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
public class ListeningHistoryService {

	private final ListeningHistoryRepository listeningHistoryRepository;
	private final UserRepository userRepository;
	private final ListeningHistoryMapper listeningHistoryMapper;

	public ListeningHistoryService(
			ListeningHistoryRepository listeningHistoryRepository,
			UserRepository userRepository,
			ListeningHistoryMapper listeningHistoryMapper
	) {
		this.listeningHistoryRepository = listeningHistoryRepository;
		this.userRepository = userRepository;
		this.listeningHistoryMapper = listeningHistoryMapper;
	}

	@Transactional(readOnly = true)
	public Page<ListeningHistoryResponse> findHistory(UUID userId, Pageable pageable) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
		return listeningHistoryRepository.findByUserOrderByPlayedAtDesc(user, pageable)
				.map(listeningHistoryMapper::toResponse);
	}
}
