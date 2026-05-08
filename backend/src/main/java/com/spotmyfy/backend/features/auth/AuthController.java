package com.spotmyfy.backend.features.auth;

import com.spotmyfy.backend.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@GetMapping("/status")
	public ApiResponse<String> status() {
		return ApiResponse.success("Auth module is ready");
	}
}
