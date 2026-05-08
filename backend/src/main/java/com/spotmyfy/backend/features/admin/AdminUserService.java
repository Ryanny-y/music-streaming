package com.spotmyfy.backend.features.admin;

import com.spotmyfy.backend.features.user.domain.Role;
import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.domain.UserRole;
import com.spotmyfy.backend.features.user.dto.AdminUserResponse;
import com.spotmyfy.backend.features.user.dto.UpdateUserRoleRequest;
import com.spotmyfy.backend.features.user.dto.UpdateUserStatusRequest;
import com.spotmyfy.backend.features.user.mapper.UserMapper;
import com.spotmyfy.backend.features.user.repository.RoleRepository;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminUserService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserMapper userMapper;

	public AdminUserService(UserRepository userRepository, RoleRepository roleRepository, UserMapper userMapper) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userMapper = userMapper;
	}

	@Transactional(readOnly = true)
	public Page<AdminUserResponse> findUsers(Pageable pageable) {
		return userRepository.findAllByOrderByCreatedAtDesc(pageable)
				.map(userMapper::toAdminResponse);
	}

	@Transactional(readOnly = true)
	public AdminUserResponse findUser(UUID userId) {
		return userMapper.toAdminResponse(findUserById(userId));
	}

	@Transactional
	public AdminUserResponse updateStatus(UUID currentAdminId, UUID userId, UpdateUserStatusRequest request) {
		User user = findUserById(userId);
		if (Boolean.FALSE.equals(request.active())) {
			ensureNotRemovingLastActiveAdmin(currentAdminId, user);
			user.setRefreshToken(null);
			user.setRefreshTokenExp(null);
		}
		user.setActive(request.active());
		return userMapper.toAdminResponse(userRepository.save(user));
	}

	@Transactional
	public AdminUserResponse updateRole(UUID currentAdminId, UUID userId, UpdateUserRoleRequest request) {
		User user = findUserById(userId);
		if (user.getRole().getRoleName() == UserRole.ADMIN && request.role() != UserRole.ADMIN) {
			ensureNotRemovingLastActiveAdmin(currentAdminId, user);
		}
		Role role = roleRepository.findByRoleName(request.role())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
		user.setRole(role);
		return userMapper.toAdminResponse(userRepository.save(user));
	}

	private User findUserById(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

	private void ensureNotRemovingLastActiveAdmin(UUID currentAdminId, User targetUser) {
		boolean targetIsActiveAdmin = Boolean.TRUE.equals(targetUser.getActive())
				&& targetUser.getRole().getRoleName() == UserRole.ADMIN;
		if (!targetIsActiveAdmin) {
			return;
		}
		long activeAdmins = userRepository.countByRoleRoleNameAndActive(UserRole.ADMIN, true);
		if (activeAdmins <= 1) {
			String message = targetUser.getUserId().equals(currentAdminId)
					? "You cannot remove your own admin access as the only active admin"
					: "Cannot remove the only active admin";
			throw new ResponseStatusException(HttpStatus.CONFLICT, message);
		}
	}
}
