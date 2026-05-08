package com.spotmyfy.backend.features.favorite.repository;

import com.spotmyfy.backend.features.favorite.domain.Favorite;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

	List<Favorite> findByUser(User user);

	boolean existsByUserAndSong(User user, Song song);

	void deleteByUserAndSong(User user, Song song);
}
