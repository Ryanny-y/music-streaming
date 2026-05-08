package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.song.dto.SongDetailsResponse;
import com.spotmyfy.backend.features.song.dto.SongResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicSongController {

	private final PublicSongService publicSongService;

	public PublicSongController(PublicSongService publicSongService) {
		this.publicSongService = publicSongService;
	}

	@GetMapping("/songs")
	public ApiResponse<Page<SongResponse>> findSongs(
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(publicSongService.findPublishedSongs(pageable));
	}

	@GetMapping("/songs/{songId}")
	public ApiResponse<SongDetailsResponse> findSong(@PathVariable UUID songId) {
		return ApiResponse.success(publicSongService.findPublishedSong(songId));
	}

	@GetMapping("/songs/search")
	public ApiResponse<Page<SongResponse>> searchSongs(
			@RequestParam String query,
			@PageableDefault(size = 20, sort = "title", direction = Sort.Direction.ASC) Pageable pageable
	) {
		return ApiResponse.success(publicSongService.searchPublishedSongs(query, pageable));
	}

	@GetMapping("/categories/{categoryId}/songs")
	public ApiResponse<Page<SongResponse>> findSongsByCategory(
			@PathVariable UUID categoryId,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(publicSongService.findPublishedSongsByCategory(categoryId, pageable));
	}

	@GetMapping("/tags/{tagId}/songs")
	public ApiResponse<Page<SongResponse>> findSongsByTag(
			@PathVariable UUID tagId,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(publicSongService.findPublishedSongsByTag(tagId, pageable));
	}
}
