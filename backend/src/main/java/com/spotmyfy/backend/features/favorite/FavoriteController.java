package com.spotmyfy.backend.features.favorite;

import com.spotmyfy.backend.features.favorite.dto.FavoriteResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me/favorites")
public class FavoriteController {

	private final FavoriteService favoriteService;

	public FavoriteController(FavoriteService favoriteService) {
		this.favoriteService = favoriteService;
	}

	@GetMapping
	public ApiResponse<Page<FavoriteResponse>> findFavorites(
			@AuthenticationPrincipal UserPrincipal principal,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(favoriteService.findFavorites(principal.getUserId(), pageable));
	}

	@PostMapping("/{songId}")
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<FavoriteResponse> addFavorite(
			@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID songId
	) {
		return ApiResponse.success("Favorite added", favoriteService.addFavorite(principal.getUserId(), songId));
	}

	@DeleteMapping("/{songId}")
	public ApiResponse<Void> removeFavorite(
			@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID songId
	) {
		favoriteService.removeFavorite(principal.getUserId(), songId);
		return ApiResponse.success("Favorite removed", null);
	}
}
