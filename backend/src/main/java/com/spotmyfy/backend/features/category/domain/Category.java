package com.spotmyfy.backend.features.category.domain;

import com.spotmyfy.backend.features.song.domain.Song;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Category {

	@Id
	@Column(name = "category_id", nullable = false)
	@EqualsAndHashCode.Include
	private UUID categoryId;

	@Column(name = "name", nullable = false, unique = true, length = 100)
	private String name;

	@Column(name = "description", columnDefinition = "text")
	private String description;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Builder.Default
	@OneToMany(mappedBy = "category")
	@ToString.Exclude
	private List<Song> songs = new ArrayList<>();

	@PrePersist
	void prePersist() {
		if (categoryId == null) {
			categoryId = UUID.randomUUID();
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
