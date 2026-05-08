package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.history.dto.ListeningHistoryResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/songs")
public class SongPlayController {

	private final SongPlayService songPlayService;

	public SongPlayController(SongPlayService songPlayService) {
		this.songPlayService = songPlayService;
	}

	@PostMapping("/{songId}/play")
	public ApiResponse<ListeningHistoryResponse> playSong(
			@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID songId
	) {
		return ApiResponse.success("Song play recorded", songPlayService.playSong(principal.getUserId(), songId));
	}
}
