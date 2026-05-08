package com.spotmyfy.backend.features.history.domain;

import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "listening_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ListeningHistory {

	@Id
	@Column(name = "history_id", nullable = false)
	@EqualsAndHashCode.Include
	private UUID historyId;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	@ToString.Exclude
	private User user;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "song_id", nullable = false)
	@ToString.Exclude
	private Song song;

	@Column(name = "played_at")
	private LocalDateTime playedAt;

	@PrePersist
	void prePersist() {
		if (historyId == null) {
			historyId = UUID.randomUUID();
		}
		if (playedAt == null) {
			playedAt = LocalDateTime.now();
		}
	}
}
