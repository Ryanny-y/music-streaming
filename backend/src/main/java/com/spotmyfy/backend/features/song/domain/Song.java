package com.spotmyfy.backend.features.song.domain;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import com.spotmyfy.backend.features.tag.domain.Tag;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "songs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Song {

	@Id
	@Column(name = "song_id", nullable = false)
	@EqualsAndHashCode.Include
	private UUID songId;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "artist", nullable = false, length = 150)
	private String artist;

	@Column(name = "album", length = 150)
	private String album;

	@Column(name = "description", columnDefinition = "text")
	private String description;

	@Column(name = "lyrics", columnDefinition = "text")
	private String lyrics;

	@Column(name = "audio_url", columnDefinition = "text")
	private String audioUrl;

	@Column(name = "cover_image_url", columnDefinition = "text")
	private String coverImageUrl;

	@Column(name = "duration", length = 20)
	private String duration;

	@Column(name = "release_date")
	private LocalDate releaseDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	@ToString.Exclude
	private Category category;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 30)
	private SongStatus status;

	@Column(name = "play_count")
	private Long playCount;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Builder.Default
	@ManyToMany
	@JoinTable(
		name = "song_tags",
		joinColumns = @JoinColumn(name = "song_id"),
		inverseJoinColumns = @JoinColumn(name = "tag_id")
	)
	@ToString.Exclude
	private Set<Tag> tags = new HashSet<>();

	@Builder.Default
	@OneToMany(mappedBy = "song")
	@ToString.Exclude
	private List<Favorite> favorites = new ArrayList<>();

	@Builder.Default
	@OneToMany(mappedBy = "song")
	@ToString.Exclude
	private List<ListeningHistory> listeningHistory = new ArrayList<>();

	@PrePersist
	void prePersist() {
		if (songId == null) {
			songId = UUID.randomUUID();
		}
		if (status == null) {
			status = SongStatus.UNPUBLISHED;
		}
		if (playCount == null) {
			playCount = 0L;
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
