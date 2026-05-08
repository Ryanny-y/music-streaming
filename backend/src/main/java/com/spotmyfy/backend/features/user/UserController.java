package com.spotmyfy.backend.features.user;

import com.spotmyfy.backend.features.user.dto.UpdateProfileRequest;
import com.spotmyfy.backend.features.user.dto.UserDashboardResponse;
import com.spotmyfy.backend.features.user.dto.UserResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public ApiResponse<UserResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.success(userService.getProfile(principal.getUserId()));
	}

	@PutMapping
	public ApiResponse<UserResponse> updateProfile(
			@AuthenticationPrincipal UserPrincipal principal,
			@Valid @RequestBody UpdateProfileRequest request
	) {
		return ApiResponse.success("Profile updated", userService.updateProfile(principal.getUserId(), request));
	}

	@GetMapping("/dashboard")
	public ApiResponse<UserDashboardResponse> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.success(userService.getDashboard(principal.getUserId()));
	}
}
