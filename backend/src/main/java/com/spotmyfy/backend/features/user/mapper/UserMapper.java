package com.spotmyfy.backend.features.user.mapper;

import com.spotmyfy.backend.features.user.domain.Role;
import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.domain.UserRole;
import com.spotmyfy.backend.features.user.dto.AdminUserResponse;
import com.spotmyfy.backend.features.user.dto.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

	@Mapping(target = "role", expression = "java(toRoleName(user.getRole()))")
	UserResponse toResponse(User user);

	@Mapping(target = "role", expression = "java(toRoleName(user.getRole()))")
	AdminUserResponse toAdminResponse(User user);

	default UserRole toRoleName(Role role) {
		return role == null ? null : role.getRoleName();
	}
}
