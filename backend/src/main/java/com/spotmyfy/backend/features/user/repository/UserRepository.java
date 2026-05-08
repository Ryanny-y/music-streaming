package com.spotmyfy.backend.features.user.repository;

import com.spotmyfy.backend.features.user.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

	Optional<User> findByEmail(String email);

	Optional<User> findByUsername(String username);

	Optional<User> findByRefreshToken(String refreshToken);

	boolean existsByEmail(String email);

	boolean existsByUsername(String username);
}
