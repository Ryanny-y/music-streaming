package com.spotmyfy.backend.features.category.repository;

import com.spotmyfy.backend.features.category.domain.Category;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

	Optional<Category> findByName(String name);

	Optional<Category> findByNameIgnoreCase(String name);
}
