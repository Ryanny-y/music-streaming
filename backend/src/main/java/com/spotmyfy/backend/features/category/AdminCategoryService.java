package com.spotmyfy.backend.features.category;

import com.spotmyfy.backend.features.category.domain.Category;
import com.spotmyfy.backend.features.category.dto.CategoryResponse;
import com.spotmyfy.backend.features.category.dto.CreateCategoryRequest;
import com.spotmyfy.backend.features.category.dto.UpdateCategoryRequest;
import com.spotmyfy.backend.features.category.mapper.CategoryMapper;
import com.spotmyfy.backend.features.category.repository.CategoryRepository;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminCategoryService {

	private final CategoryRepository categoryRepository;
	private final SongRepository songRepository;
	private final CategoryMapper categoryMapper;

	public AdminCategoryService(
			CategoryRepository categoryRepository,
			SongRepository songRepository,
			CategoryMapper categoryMapper
	) {
		this.categoryRepository = categoryRepository;
		this.songRepository = songRepository;
		this.categoryMapper = categoryMapper;
	}

	@Transactional(readOnly = true)
	public Page<CategoryResponse> findCategories(Pageable pageable) {
		return categoryRepository.findAll(pageable)
				.map(categoryMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public CategoryResponse findCategory(UUID categoryId) {
		return categoryMapper.toResponse(findCategoryById(categoryId));
	}

	@Transactional
	public CategoryResponse createCategory(CreateCategoryRequest request) {
		String name = normalizeName(request.name());
		ensureNameAvailable(name, null);
		Category category = Category.builder()
				.name(name)
				.description(request.description())
				.build();
		return categoryMapper.toResponse(categoryRepository.save(category));
	}

	@Transactional
	public CategoryResponse updateCategory(UUID categoryId, UpdateCategoryRequest request) {
		Category category = findCategoryById(categoryId);
		String name = normalizeName(request.name());
		ensureNameAvailable(name, categoryId);
		category.setName(name);
		category.setDescription(request.description());
		return categoryMapper.toResponse(categoryRepository.save(category));
	}

	@Transactional
	public void deleteCategory(UUID categoryId) {
		Category category = findCategoryById(categoryId);
		long songsUsingCategory = songRepository.countByCategory(category);
		if (songsUsingCategory > 0) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete category while songs still use it");
		}
		categoryRepository.delete(category);
	}

	private Category findCategoryById(UUID categoryId) {
		return categoryRepository.findById(categoryId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
	}

	private void ensureNameAvailable(String name, UUID currentCategoryId) {
		categoryRepository.findByNameIgnoreCase(name)
				.filter(existing -> currentCategoryId == null || !existing.getCategoryId().equals(currentCategoryId))
				.ifPresent(existing -> {
					throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name is already in use");
				});
	}

	private String normalizeName(String name) {
		String normalized = name == null ? "" : name.trim();
		if (normalized.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name is required");
		}
		return normalized;
	}
}
