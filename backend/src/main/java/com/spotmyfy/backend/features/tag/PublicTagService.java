package com.spotmyfy.backend.features.tag;

import com.spotmyfy.backend.features.tag.dto.TagResponse;
import com.spotmyfy.backend.features.tag.mapper.TagMapper;
import com.spotmyfy.backend.features.tag.repository.TagRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicTagService {

	private final TagRepository tagRepository;
	private final TagMapper tagMapper;

	public PublicTagService(TagRepository tagRepository, TagMapper tagMapper) {
		this.tagRepository = tagRepository;
		this.tagMapper = tagMapper;
	}

	@Transactional(readOnly = true)
	public Page<TagResponse> findTags(Pageable pageable) {
		return tagRepository.findAll(pageable)
				.map(tagMapper::toResponse);
	}
}
