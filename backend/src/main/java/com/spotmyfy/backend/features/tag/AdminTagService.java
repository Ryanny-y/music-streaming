package com.spotmyfy.backend.features.tag;

import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.tag.domain.Tag;
import com.spotmyfy.backend.features.tag.dto.CreateTagRequest;
import com.spotmyfy.backend.features.tag.dto.TagResponse;
import com.spotmyfy.backend.features.tag.dto.UpdateTagRequest;
import com.spotmyfy.backend.features.tag.mapper.TagMapper;
import com.spotmyfy.backend.features.tag.repository.TagRepository;
import java.util.HashSet;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminTagService {

	private final TagRepository tagRepository;
	private final TagMapper tagMapper;

	public AdminTagService(TagRepository tagRepository, TagMapper tagMapper) {
		this.tagRepository = tagRepository;
		this.tagMapper = tagMapper;
	}

	@Transactional(readOnly = true)
	public Page<TagResponse> findTags(Pageable pageable) {
		return tagRepository.findAll(pageable)
				.map(tagMapper::toResponse);
	}

	@Transactional(readOnly = true)
	public TagResponse findTag(UUID tagId) {
		return tagMapper.toResponse(findTagById(tagId));
	}

	@Transactional
	public TagResponse createTag(CreateTagRequest request) {
		String name = normalizeName(request.name());
		ensureNameAvailable(name, null);
		Tag tag = Tag.builder()
				.name(name)
				.build();
		return tagMapper.toResponse(tagRepository.save(tag));
	}

	@Transactional
	public TagResponse updateTag(UUID tagId, UpdateTagRequest request) {
		Tag tag = findTagById(tagId);
		String name = normalizeName(request.name());
		ensureNameAvailable(name, tagId);
		tag.setName(name);
		return tagMapper.toResponse(tagRepository.save(tag));
	}

	@Transactional
	public void deleteTag(UUID tagId) {
		Tag tag = findTagById(tagId);
		for (Song song : new HashSet<>(tag.getSongs())) {
			song.getTags().remove(tag);
		}
		tag.getSongs().clear();
		tagRepository.delete(tag);
	}

	private Tag findTagById(UUID tagId) {
		return tagRepository.findById(tagId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found"));
	}

	private void ensureNameAvailable(String name, UUID currentTagId) {
		tagRepository.findByNameIgnoreCase(name)
				.filter(existing -> currentTagId == null || !existing.getTagId().equals(currentTagId))
				.ifPresent(existing -> {
					throw new ResponseStatusException(HttpStatus.CONFLICT, "Tag name is already in use");
				});
	}

	private String normalizeName(String name) {
		String normalized = name == null ? "" : name.trim();
		if (normalized.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag name is required");
		}
		return normalized;
	}
}
