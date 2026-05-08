package com.spotmyfy.backend.features.history.repository;

import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, UUID> {

	List<ListeningHistory> findByUserOrderByPlayedAtDesc(User user);

	Page<ListeningHistory> findByUserOrderByPlayedAtDesc(User user, Pageable pageable);

	long countByUser(User user);

	@Query("select count(distinct h.song.songId) from ListeningHistory h where h.user = :user")
	long countDistinctSongsByUser(@Param("user") User user);
}
