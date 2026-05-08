package com.spotmyfy.backend.features.category;

import com.spotmyfy.backend.features.category.dto.CategoryResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/categories")
public class PublicCategoryController {

	private final PublicCategoryService publicCategoryService;

	public PublicCategoryController(PublicCategoryService publicCategoryService) {
		this.publicCategoryService = publicCategoryService;
	}

	@GetMapping
	public ApiResponse<Page<CategoryResponse>> findCategories(
			@PageableDefault(size = 50, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
	) {
		return ApiResponse.success(publicCategoryService.findCategories(pageable));
	}
}
