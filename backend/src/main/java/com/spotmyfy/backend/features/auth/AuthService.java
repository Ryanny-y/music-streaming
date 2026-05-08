package com.spotmyfy.backend.features.auth;

import com.spotmyfy.backend.features.auth.dto.AuthResponse;
import com.spotmyfy.backend.features.auth.dto.LoginRequest;
import com.spotmyfy.backend.features.auth.dto.RefreshTokenRequest;
import com.spotmyfy.backend.features.auth.dto.RegisterRequest;
import com.spotmyfy.backend.features.user.domain.Role;
import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.domain.UserRole;
import com.spotmyfy.backend.features.user.mapper.UserMapper;
import com.spotmyfy.backend.features.user.repository.RoleRepository;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import com.spotmyfy.backend.shared.security.JwtProperties;
import com.spotmyfy.backend.shared.security.JwtService;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

	private static final long REFRESH_TOKEN_DAYS = 7;

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final JwtProperties jwtProperties;
	private final UserMapper userMapper;

	public AuthService(
			UserRepository userRepository,
			RoleRepository roleRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService,
			JwtProperties jwtProperties,
			UserMapper userMapper
	) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.jwtProperties = jwtProperties;
		this.userMapper = userMapper;
	}

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByUsername(request.username())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
		}
		if (userRepository.existsByEmail(request.email())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
		}

		Role userRole = roleRepository.findByRoleName(UserRole.USER)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Default USER role is missing"));
		User user = User.builder()
				.fullName(request.fullName())
				.username(request.username())
				.email(request.email())
				.passwordHash(passwordEncoder.encode(request.password()))
				.role(userRole)
				.active(true)
				.build();
		userRepository.save(user);
		return issueTokens(user);
	}

	@Transactional
	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.usernameOrEmail())
				.or(() -> userRepository.findByEmail(request.usernameOrEmail()))
				.orElseThrow(() -> new BadCredentialsException("Invalid username/email or password"));
		if (!Boolean.TRUE.equals(user.getActive())) {
			throw new DisabledException("User account is inactive");
		}
		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new BadCredentialsException("Invalid username/email or password");
		}
		return issueTokens(user);
	}

	@Transactional
	public AuthResponse refreshToken(RefreshTokenRequest request) {
		User user = userRepository.findByRefreshToken(request.refreshToken())
				.orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
		if (!Boolean.TRUE.equals(user.getActive())) {
			throw new DisabledException("User account is inactive");
		}
		if (user.getRefreshTokenExp() == null || user.getRefreshTokenExp().isBefore(LocalDateTime.now())) {
			clearRefreshToken(user);
			throw new BadCredentialsException("Refresh token has expired");
		}
		return issueTokens(user);
	}

	@Transactional
	public void logout(RefreshTokenRequest request) {
		userRepository.findByRefreshToken(request.refreshToken()).ifPresent(this::clearRefreshToken);
	}

	private AuthResponse issueTokens(User user) {
		String accessToken = jwtService.generateToken(user.getUserId().toString());
		String refreshToken = UUID.randomUUID().toString();
		user.setRefreshToken(refreshToken);
		user.setRefreshTokenExp(LocalDateTime.now().plusDays(REFRESH_TOKEN_DAYS));
		userRepository.save(user);
		return new AuthResponse(
				accessToken,
				refreshToken,
				"Bearer",
				jwtProperties.expirationMinutes(),
				userMapper.toResponse(user)
		);
	}

	private void clearRefreshToken(User user) {
		user.setRefreshToken(null);
		user.setRefreshTokenExp(null);
		userRepository.save(user);
	}
}
