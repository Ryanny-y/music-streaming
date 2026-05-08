package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.song.dto.CreateSongRequest;
import com.spotmyfy.backend.features.song.dto.SongDetailsResponse;
import com.spotmyfy.backend.features.song.dto.SongResponse;
import com.spotmyfy.backend.features.song.dto.UpdateSongRequest;
import com.spotmyfy.backend.features.song.dto.UpdateSongStatusRequest;
import com.spotmyfy.backend.shared.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/songs")
public class AdminSongController {

	private final AdminSongService adminSongService;

	public AdminSongController(AdminSongService adminSongService) {
		this.adminSongService = adminSongService;
	}

	@GetMapping
	public ApiResponse<Page<SongResponse>> findSongs(
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(adminSongService.findSongs(pageable));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<SongDetailsResponse> createSong(@Valid @RequestBody CreateSongRequest request) {
		return ApiResponse.success("Song created", adminSongService.createSong(request));
	}

	@GetMapping("/{songId}")
	public ApiResponse<SongDetailsResponse> findSong(@PathVariable UUID songId) {
		return ApiResponse.success(adminSongService.findSong(songId));
	}

	@PutMapping("/{songId}")
	public ApiResponse<SongDetailsResponse> updateSong(
			@PathVariable UUID songId,
			@Valid @RequestBody UpdateSongRequest request
	) {
		return ApiResponse.success("Song updated", adminSongService.updateSong(songId, request));
	}

	@DeleteMapping("/{songId}")
	public ApiResponse<Void> deleteSong(@PathVariable UUID songId) {
		adminSongService.deleteSong(songId);
		return ApiResponse.success("Song deleted", null);
	}

	@PatchMapping("/{songId}/status")
	public ApiResponse<SongDetailsResponse> updateStatus(
			@PathVariable UUID songId,
			@Valid @RequestBody UpdateSongStatusRequest request
	) {
		return ApiResponse.success("Song status updated", adminSongService.updateStatus(songId, request));
	}

	@PostMapping(value = "/{songId}/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<SongDetailsResponse> uploadAudio(
			@PathVariable UUID songId,
			@RequestParam("file") MultipartFile file
	) {
		return ApiResponse.success("Audio uploaded", adminSongService.uploadAudio(songId, file));
	}

	@PostMapping(value = "/{songId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<SongDetailsResponse> uploadCover(
			@PathVariable UUID songId,
			@RequestParam("file") MultipartFile file
	) {
		return ApiResponse.success("Cover uploaded", adminSongService.uploadCover(songId, file));
	}
}
