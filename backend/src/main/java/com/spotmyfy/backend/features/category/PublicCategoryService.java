package com.spotmyfy.backend.features.category;

import com.spotmyfy.backend.features.category.dto.CategoryResponse;
import com.spotmyfy.backend.features.category.mapper.CategoryMapper;
import com.spotmyfy.backend.features.category.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicCategoryService {

	private final CategoryRepository categoryRepository;
	private final CategoryMapper categoryMapper;

	public PublicCategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
		this.categoryRepository = categoryRepository;
		this.categoryMapper = categoryMapper;
	}

	@Transactional(readOnly = true)
	public Page<CategoryResponse> findCategories(Pageable pageable) {
		return categoryRepository.findAll(pageable)
				.map(categoryMapper::toResponse);
	}
}
