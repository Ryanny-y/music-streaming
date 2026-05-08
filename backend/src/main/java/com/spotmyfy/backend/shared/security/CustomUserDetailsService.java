package com.spotmyfy.backend.shared.security;

import com.spotmyfy.backend.features.user.domain.User;
import com.spotmyfy.backend.features.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String usernameOrEmail) {
		User user = userRepository.findByUsername(usernameOrEmail)
				.or(() -> userRepository.findByEmail(usernameOrEmail))
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return toPrincipal(user);
	}

	@Transactional(readOnly = true)
	public UserDetails loadUserById(UUID userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return toPrincipal(user);
	}

	private UserPrincipal toPrincipal(User user) {
		if (!Boolean.TRUE.equals(user.getActive())) {
			throw new DisabledException("User account is inactive");
		}
		return UserPrincipal.from(user);
	}
}
