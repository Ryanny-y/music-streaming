package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.category.repository.CategoryRepository;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.song.dto.SongDetailsResponse;
import com.spotmyfy.backend.features.song.dto.SongResponse;
import com.spotmyfy.backend.features.song.mapper.SongMapper;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import com.spotmyfy.backend.features.tag.domain.Tag;
import com.spotmyfy.backend.features.tag.repository.TagRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PublicSongService {

	private final SongRepository songRepository;
	private final CategoryRepository categoryRepository;
	private final TagRepository tagRepository;
	private final SongMapper songMapper;

	public PublicSongService(
			SongRepository songRepository,
			CategoryRepository categoryRepository,
			TagRepository tagRepository,
			SongMapper songMapper
	) {
		this.songRepository = songRepository;
		this.categoryRepository = categoryRepository;
		this.tagRepository = tagRepository;
		this.songMapper = songMapper;
	}

	@Transactional(readOnly = true)
	public Page<SongResponse> findPublishedSongs(Pageable pageable) {
		return songRepository.findByStatus(SongStatus.PUBLISHED, pageable)
				.map(songMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public SongDetailsResponse findPublishedSong(UUID songId) {
		Song song = songRepository.findByIdAndStatus(songId, SongStatus.PUBLISHED)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Published song not found"));
		return songMapper.toDetailsResponse(song);
	}

	@Transactional(readOnly = true)
	public Page<SongResponse> searchPublishedSongs(String query, Pageable pageable) {
		String trimmedQuery = query == null ? "" : query.trim();
		if (trimmedQuery.isBlank()) {
			return findPublishedSongs(pageable);
		}
		return songRepository.searchPublishedByTitleOrArtist(trimmedQuery, pageable)
				.map(songMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public Page<SongResponse> findPublishedSongsByCategory(UUID categoryId, Pageable pageable) {
		Category category = categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
		return songRepository.findByCategoryAndStatus(category, SongStatus.PUBLISHED, pageable)
				.map(songMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public Page<SongResponse> findPublishedSongsByTag(UUID tagId, Pageable pageable) {
		Tag tag = tagRepository.findById(tagId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found"));
		return songRepository.findByTagsAndStatus(tag, SongStatus.PUBLISHED, pageable)
				.map(songMapper::toResponse);
	}
}
