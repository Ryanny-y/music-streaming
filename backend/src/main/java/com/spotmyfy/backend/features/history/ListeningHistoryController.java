package com.spotmyfy.backend.features.history;

import com.spotmyfy.backend.features.history.dto.ListeningHistoryResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me/history")
public class ListeningHistoryController {

	private final ListeningHistoryService listeningHistoryService;

	public ListeningHistoryController(ListeningHistoryService listeningHistoryService) {
		this.listeningHistoryService = listeningHistoryService;
	}

	@GetMapping
	public ApiResponse<Page<ListeningHistoryResponse>> findHistory(
			@AuthenticationPrincipal UserPrincipal principal,
			@PageableDefault(size = 20, sort = "playedAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(listeningHistoryService.findHistory(principal.getUserId(), pageable));
	}
}
