package com.spotmyfy.backend.features.user.repository;

import com.spotmyfy.backend.features.user.domain.Role;
import com.spotmyfy.backend.features.user.domain.UserRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findByRoleName(UserRole roleName);
}
