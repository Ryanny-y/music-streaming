package com.spotmyfy.backend.features.tag;

import com.spotmyfy.backend.features.tag.dto.TagResponse;
import com.spotmyfy.backend.shared.response.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/tags")
public class PublicTagController {

	private final PublicTagService publicTagService;

	public PublicTagController(PublicTagService publicTagService) {
		this.publicTagService = publicTagService;
	}

	@GetMapping
	public ApiResponse<Page<TagResponse>> findTags(
			@PageableDefault(size = 50, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
	) {
		return ApiResponse.success(publicTagService.findTags(pageable));
	}
}
