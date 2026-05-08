package com.spotmyfy.backend.features.tag.repository;

import com.spotmyfy.backend.features.tag.domain.Tag;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, UUID> {

	Optional<Tag> findByName(String name);
}
