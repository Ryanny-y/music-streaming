package com.spotmyfy.backend.features.admin;

import com.spotmyfy.backend.features.user.dto.AdminUserResponse;
import com.spotmyfy.backend.features.user.dto.UpdateUserRoleRequest;
import com.spotmyfy.backend.features.user.dto.UpdateUserStatusRequest;
import com.spotmyfy.backend.shared.response.ApiResponse;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

	private final AdminUserService adminUserService;

	public AdminUserController(AdminUserService adminUserService) {
		this.adminUserService = adminUserService;
	}

	@GetMapping
	public ApiResponse<Page<AdminUserResponse>> findUsers(
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
	) {
		return ApiResponse.success(adminUserService.findUsers(pageable));
	}

	@GetMapping("/{userId}")
	public ApiResponse<AdminUserResponse> findUser(@PathVariable UUID userId) {
		return ApiResponse.success(adminUserService.findUser(userId));
	}

	@PatchMapping("/{userId}/status")
	public ApiResponse<AdminUserResponse> updateStatus(
			@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID userId,
			@Valid @RequestBody UpdateUserStatusRequest request
	) {
		return ApiResponse.success(
				"User status updated",
				adminUserService.updateStatus(principal.getUserId(), userId, request)
		);
	}

	@PatchMapping("/{userId}/role")
	public ApiResponse<AdminUserResponse> updateRole(
			@AuthenticationPrincipal UserPrincipal principal,
			@PathVariable UUID userId,
			@Valid @RequestBody UpdateUserRoleRequest request
	) {
		return ApiResponse.success(
				"User role updated",
				adminUserService.updateRole(principal.getUserId(), userId, request)
		);
	}
}
