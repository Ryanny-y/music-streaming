package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.category.repository.CategoryRepository;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.song.dto.CreateSongRequest;
import com.spotmyfy.backend.features.song.dto.SongDetailsResponse;
import com.spotmyfy.backend.features.song.dto.SongResponse;
import com.spotmyfy.backend.features.song.dto.UpdateSongRequest;
import com.spotmyfy.backend.features.song.dto.UpdateSongStatusRequest;
import com.spotmyfy.backend.features.song.mapper.SongMapper;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import com.spotmyfy.backend.features.tag.domain.Tag;
import com.spotmyfy.backend.features.tag.repository.TagRepository;
import com.spotmyfy.backend.shared.file.FileStorageService;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminSongService {

	private final SongRepository songRepository;
	private final CategoryRepository categoryRepository;
	private final TagRepository tagRepository;
	private final SongMapper songMapper;
	private final FileStorageService fileStorageService;

	public AdminSongService(
			SongRepository songRepository,
			CategoryRepository categoryRepository,
			TagRepository tagRepository,
			SongMapper songMapper,
			FileStorageService fileStorageService
	) {
		this.songRepository = songRepository;
		this.categoryRepository = categoryRepository;
		this.tagRepository = tagRepository;
		this.songMapper = songMapper;
		this.fileStorageService = fileStorageService;
	}

	@Transactional(readOnly = true)
	public Page<SongResponse> findSongs(Pageable pageable) {
		return songRepository.findAll(pageable)
				.map(songMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public SongDetailsResponse findSong(UUID songId) {
		return songMapper.toDetailsResponse(findSongById(songId));
	}

	@Transactional
	public SongDetailsResponse createSong(CreateSongRequest request) {
		Song song = Song.builder()
				.title(request.title())
				.artist(request.artist())
				.album(request.album())
				.description(request.description())
				.lyrics(request.lyrics())
				.audioUrl(request.audioUrl())
				.coverImageUrl(request.coverImageUrl())
				.duration(request.duration())
				.releaseDate(request.releaseDate())
				.category(resolveCategory(request.categoryId()))
				.tags(resolveTags(request.tagIds()))
				.status(request.status() == null ? SongStatus.UNPUBLISHED : request.status())
				.build();
		return songMapper.toDetailsResponse(songRepository.save(song));
	}

	@Transactional
	public SongDetailsResponse updateSong(UUID songId, UpdateSongRequest request) {
		Song song = findSongById(songId);
		if (request.title() != null) {
			song.setTitle(request.title());
		}
		if (request.artist() != null) {
			song.setArtist(request.artist());
		}
		if (request.album() != null) {
			song.setAlbum(request.album());
		}
		if (request.description() != null) {
			song.setDescription(request.description());
		}
		if (request.lyrics() != null) {
			song.setLyrics(request.lyrics());
		}
		if (request.audioUrl() != null) {
			song.setAudioUrl(request.audioUrl());
		}
		if (request.coverImageUrl() != null) {
			song.setCoverImageUrl(request.coverImageUrl());
		}
		if (request.duration() != null) {
			song.setDuration(request.duration());
		}
		if (request.releaseDate() != null) {
			song.setReleaseDate(request.releaseDate());
		}
		if (request.categoryId() != null) {
			song.setCategory(resolveCategory(request.categoryId()));
		}
		if (request.tagIds() != null) {
			song.setTags(resolveTags(request.tagIds()));
		}
		if (request.status() != null) {
			song.setStatus(request.status());
		}
		return songMapper.toDetailsResponse(songRepository.save(song));
	}

	@Transactional
	public void deleteSong(UUID songId) {
		Song song = findSongById(songId);
		song.getTags().clear();
		songRepository.delete(song);
	}

	@Transactional
	public SongDetailsResponse updateStatus(UUID songId, UpdateSongStatusRequest request) {
		Song song = findSongById(songId);
		song.setStatus(request.status());
		return songMapper.toDetailsResponse(songRepository.save(song));
	}

	@Transactional
	public SongDetailsResponse uploadAudio(UUID songId, MultipartFile file) {
		Song song = findSongById(songId);
		song.setAudioUrl(fileStorageService.storeAudio(file));
		return songMapper.toDetailsResponse(songRepository.save(song));
	}

	@Transactional
	public SongDetailsResponse uploadCover(UUID songId, MultipartFile file) {
		Song song = findSongById(songId);
		song.setCoverImageUrl(fileStorageService.storeCover(file));
		return songMapper.toDetailsResponse(songRepository.save(song));
	}

	private Song findSongById(UUID songId) {
		return songRepository.findById(songId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Song not found"));
	}

	private Category resolveCategory(UUID categoryId) {
		if (categoryId == null) {
			return null;
		}
		return categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
	}

	private Set<Tag> resolveTags(Set<UUID> tagIds) {
		if (tagIds == null || tagIds.isEmpty()) {
			return new HashSet<>();
		}
		Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
		if (tags.size() != tagIds.size()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more tags were not found");
		}
		return tags;
	}
}
