package com.spotmyfy.backend.features.tag;

import com.spotmyfy.backend.features.tag.dto.CreateTagRequest;
import com.spotmyfy.backend.features.tag.dto.TagResponse;
import com.spotmyfy.backend.features.tag.dto.UpdateTagRequest;
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
@RequestMapping("/api/admin/tags")
public class AdminTagController {

	private final AdminTagService adminTagService;

	public AdminTagController(AdminTagService adminTagService) {
		this.adminTagService = adminTagService;
	}

	@GetMapping
	public ApiResponse<Page<TagResponse>> findTags(
			@PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
	) {
		return ApiResponse.success(adminTagService.findTags(pageable));
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<TagResponse> createTag(@Valid @RequestBody CreateTagRequest request) {
		return ApiResponse.success("Tag created", adminTagService.createTag(request));
	}

	@GetMapping("/{tagId}")
	public ApiResponse<TagResponse> findTag(@PathVariable UUID tagId) {
		return ApiResponse.success(adminTagService.findTag(tagId));
	}

	@PutMapping("/{tagId}")
	public ApiResponse<TagResponse> updateTag(
			@PathVariable UUID tagId,
			@Valid @RequestBody UpdateTagRequest request
	) {
		return ApiResponse.success("Tag updated", adminTagService.updateTag(tagId, request));
	}

	@DeleteMapping("/{tagId}")
	public ApiResponse<Void> deleteTag(@PathVariable UUID tagId) {
		adminTagService.deleteTag(tagId);
		return ApiResponse.success("Tag deleted", null);
	}
}
