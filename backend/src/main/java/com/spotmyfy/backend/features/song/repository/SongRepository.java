package com.spotmyfy.backend.features.song.repository;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.tag.domain.Tag;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SongRepository extends JpaRepository<Song, UUID> {

	List<Song> findByStatus(SongStatus status);

	Optional<Song> findBySongIdAndStatus(UUID songId, SongStatus status);

	default Optional<Song> findByIdAndStatus(UUID songId, SongStatus status) {
		return findBySongIdAndStatus(songId, status);
	}

	@Query("""
		select s
		from Song s
		where s.status = com.spotmyfy.backend.features.song.domain.SongStatus.PUBLISHED
		  and (
		  	lower(s.title) like lower(concat('%', :query, '%'))
		  	or lower(s.artist) like lower(concat('%', :query, '%'))
		  )
		order by s.title asc
		""")
	List<Song> searchPublishedByTitleOrArtist(@Param("query") String query);

	List<Song> findByCategory(Category category);

	List<Song> findByCategoryAndStatus(Category category, SongStatus status);

	List<Song> findByTags(Tag tag);

	List<Song> findByTagsAndStatus(Tag tag, SongStatus status);

	List<Song> findByStatusOrderByPlayCountDesc(SongStatus status, Pageable pageable);

	List<Song> findTop10ByStatusOrderByPlayCountDesc(SongStatus status);
}
