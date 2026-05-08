package com.spotmyfy.backend.features.user.domain;

import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

	@Id
	@Column(name = "user_id", nullable = false)
	@EqualsAndHashCode.Include
	private UUID userId;

	@Column(name = "full_name", nullable = false, length = 150)
	private String fullName;

	@Column(name = "username", nullable = false, unique = true, length = 80)
	private String username;

	@Column(name = "email", nullable = false, unique = true, length = 150)
	private String email;

	@Column(name = "password_hash", nullable = false)
	private String passwordHash;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "role_id", nullable = false)
	@ToString.Exclude
	private Role role;

	@Column(name = "is_active")
	private Boolean active;

	@Column(name = "refresh_token", columnDefinition = "text")
	private String refreshToken;

	@Column(name = "refresh_token_exp")
	private LocalDateTime refreshTokenExp;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Builder.Default
	@OneToMany(mappedBy = "user")
	@ToString.Exclude
	private List<Favorite> favorites = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "user")
	@ToString.Exclude
	private List<ListeningHistory> listeningHistory = new ArrayList<>();

	@PrePersist
	void prePersist() {
		if (userId == null) {
			userId = UUID.randomUUID();
		}
		if (active == null) {
			active = true;
		}
		LocalDateTime now = LocalDateTime.now();
		if (createdAt == null) {
			createdAt = now;
		}
		updatedAt = now;
	}

	@PreUpdate
	void preUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
