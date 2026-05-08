package com.spotmyfy.backend.features.admin;

import com.spotmyfy.backend.features.admin.dto.AdminDashboardResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

	private final AdminDashboardService adminDashboardService;

	public AdminDashboardController(AdminDashboardService adminDashboardService) {
		this.adminDashboardService = adminDashboardService;
	}

	@GetMapping
	public ApiResponse<AdminDashboardResponse> getDashboard() {
		return ApiResponse.success(adminDashboardService.getDashboard());
	}
}
