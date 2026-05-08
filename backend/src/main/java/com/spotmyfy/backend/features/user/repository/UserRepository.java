package com.spotmyfy.backend.features.user.repository;

import com.spotmyfy.backend.features.user.domain.UserRole;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

	Optional<User> findByEmail(String email);

	Optional<User> findByUsername(String username);

	Optional<User> findByRefreshToken(String refreshToken);

	Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);

	boolean existsByEmail(String email);

	boolean existsByUsername(String username);

	long countByActiveTrue();

	long countByRoleRoleNameAndActive(UserRole roleName, Boolean active);
}
