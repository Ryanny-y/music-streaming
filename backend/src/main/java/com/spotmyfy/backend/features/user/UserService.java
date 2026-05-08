package com.spotmyfy.backend.features.user;

import com.spotmyfy.backend.features.favorite.repository.FavoriteRepository;
import com.spotmyfy.backend.features.history.repository.ListeningHistoryRepository;
import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.dto.UpdateProfileRequest;
import com.spotmyfy.backend.features.user.dto.UserDashboardResponse;
import com.spotmyfy.backend.features.user.dto.UserResponse;
import com.spotmyfy.backend.features.user.mapper.UserMapper;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final FavoriteRepository favoriteRepository;
	private final ListeningHistoryRepository listeningHistoryRepository;
	private final UserMapper userMapper;

	public UserService(
			UserRepository userRepository,
			FavoriteRepository favoriteRepository,
			ListeningHistoryRepository listeningHistoryRepository,
			UserMapper userMapper
	) {
		this.userRepository = userRepository;
		this.favoriteRepository = favoriteRepository;
		this.listeningHistoryRepository = listeningHistoryRepository;
		this.userMapper = userMapper;
	}

	@Transactional(readOnly = true)
	public UserResponse getProfile(UUID userId) {
		return userMapper.toResponse(findCurrentUser(userId));
	}

	@Transactional
	public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
		User user = findCurrentUser(userId);
		userRepository.findByUsername(request.username())
				.filter(existing -> !existing.getUserId().equals(userId))
				.ifPresent(existing -> {
					throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
				});
		userRepository.findByEmail(request.email())
				.filter(existing -> !existing.getUserId().equals(userId))
				.ifPresent(existing -> {
					throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
				});

		user.setFullName(request.fullName());
		user.setUsername(request.username());
		user.setEmail(request.email());
		return userMapper.toResponse(userRepository.save(user));
	}

	@Transactional(readOnly = true)
	public UserDashboardResponse getDashboard(UUID userId) {
		User user = findCurrentUser(userId);
		return new UserDashboardResponse(
				favoriteRepository.countByUser(user),
				listeningHistoryRepository.countDistinctSongsByUser(user),
				listeningHistoryRepository.countByUser(user)
		);
	}

	private User findCurrentUser(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}
}
