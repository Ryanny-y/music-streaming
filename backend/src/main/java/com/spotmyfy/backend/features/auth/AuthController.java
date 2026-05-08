package com.spotmyfy.backend.features.auth;

import com.spotmyfy.backend.features.auth.dto.AuthResponse;
import com.spotmyfy.backend.features.auth.dto.LoginRequest;
import com.spotmyfy.backend.features.auth.dto.RefreshTokenRequest;
import com.spotmyfy.backend.features.auth.dto.RegisterRequest;
import com.spotmyfy.backend.shared.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ApiResponse.success("Registration successful", authService.register(request));
	}

	@PostMapping("/login")
	public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ApiResponse.success("Login successful", authService.login(request));
	}

	@PostMapping("/refresh-token")
	public ApiResponse<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
		return ApiResponse.success("Token refreshed", authService.refreshToken(request));
	}

	@PostMapping("/logout")
	public ApiResponse<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
		authService.logout(request);
		return ApiResponse.success("Logout successful", null);
	}
}
