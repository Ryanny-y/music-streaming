package com.spotmyfy.backend.features.favorite.repository;

import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

	List<Favorite> findByUser(User user);

	Page<Favorite> findByUser(User user, Pageable pageable);

	long countByUser(User user);

	boolean existsByUserAndSong(User user, Song song);

	void deleteByUserAndSong(User user, Song song);

	@Modifying
	@Query("delete from Favorite f where f.user = :user and f.song.songId = :songId")
	int deleteByUserAndSongId(@Param("user") User user, @Param("songId") UUID songId);
}
