package com.spotmyfy.backend.features.category;

import com.spotmyfy.backend.features.category.dto.CategoryResponse;
import com.spotmyfy.backend.features.category.dto.CreateCategoryRequest;
import com.spotmyfy.backend.features.category.dto.UpdateCategoryRequest;
import com.spotmyfy.backend.shared.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

	private final AdminCategoryService adminCategoryService;

	public AdminCategoryController(AdminCategoryService adminCategoryService) {
		this.adminCategoryService = adminCategoryService;
	}

	@GetMapping
	public ApiResponse<Page<CategoryResponse>> findCategories(
			@PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
	) {
		return ApiResponse.success(adminCategoryService.findCategories(pageable));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
		return ApiResponse.success("Category created", adminCategoryService.createCategory(request));
	}

	@GetMapping("/{categoryId}")
	public ApiResponse<CategoryResponse> findCategory(@PathVariable UUID categoryId) {
		return ApiResponse.success(adminCategoryService.findCategory(categoryId));
	}

	@PutMapping("/{categoryId}")
	public ApiResponse<CategoryResponse> updateCategory(
			@PathVariable UUID categoryId,
			@Valid @RequestBody UpdateCategoryRequest request
	) {
		return ApiResponse.success("Category updated", adminCategoryService.updateCategory(categoryId, request));
	}

	@DeleteMapping("/{categoryId}")
	public ApiResponse<Void> deleteCategory(@PathVariable UUID categoryId) {
		adminCategoryService.deleteCategory(categoryId);
		return ApiResponse.success("Category deleted", null);
	}
}
