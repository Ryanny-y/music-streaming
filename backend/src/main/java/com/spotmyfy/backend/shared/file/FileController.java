package com.spotmyfy.backend.shared.file;

import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/files")
public class FileController {

	private final FileStorageService fileStorageService;

	public FileController(FileStorageService fileStorageService) {
		this.fileStorageService = fileStorageService;
	}

	@GetMapping("/covers/{filename}")
	public ResponseEntity<Resource> getCover(@PathVariable String filename) throws IOException {
		Resource resource = fileStorageService.loadCover(filename);
		return ResponseEntity.ok()
				.contentType(fileStorageService.contentType(resource))
				.header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
				.contentLength(resource.contentLength())
				.body(resource);
	}
}
