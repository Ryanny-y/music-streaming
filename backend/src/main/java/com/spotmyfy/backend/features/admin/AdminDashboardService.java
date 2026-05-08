package com.spotmyfy.backend.features.admin;

import com.spotmyfy.backend.features.admin.dto.AdminDashboardResponse;
import com.spotmyfy.backend.features.category.repository.CategoryRepository;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.song.mapper.SongMapper;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import com.spotmyfy.backend.features.tag.repository.TagRepository;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardService {

	private static final int DASHBOARD_SONG_LIMIT = 10;

	private final UserRepository userRepository;
	private final SongRepository songRepository;
	private final CategoryRepository categoryRepository;
	private final TagRepository tagRepository;
	private final SongMapper songMapper;

	public AdminDashboardService(
			UserRepository userRepository,
			SongRepository songRepository,
			CategoryRepository categoryRepository,
			TagRepository tagRepository,
			SongMapper songMapper
	) {
		this.userRepository = userRepository;
		this.songRepository = songRepository;
		this.categoryRepository = categoryRepository;
		this.tagRepository = tagRepository;
		this.songMapper = songMapper;
	}

	@Transactional(readOnly = true)
	public AdminDashboardResponse getDashboard() {
		return new AdminDashboardResponse(
				userRepository.count(),
				userRepository.countByActiveTrue(),
				songRepository.count(),
				songRepository.countByStatus(SongStatus.PUBLISHED),
				categoryRepository.count(),
				tagRepository.count(),
				songRepository.findByStatusOrderByPlayCountDesc(SongStatus.PUBLISHED, PageRequest.of(0, DASHBOARD_SONG_LIMIT))
						.stream()
						.map(songMapper::toResponse)
						.toList(),
				songRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, DASHBOARD_SONG_LIMIT))
						.stream()
						.map(songMapper::toResponse)
						.toList()
		);
	}
}
