package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.shared.file.FileStorageService;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/songs")
public class SongStreamingController {

	private final SongStreamingService songStreamingService;
	private final FileStorageService fileStorageService;

	public SongStreamingController(SongStreamingService songStreamingService, FileStorageService fileStorageService) {
		this.songStreamingService = songStreamingService;
		this.fileStorageService = fileStorageService;
	}

	@GetMapping("/{songId}/stream")
	public ResponseEntity<?> streamSong(
			@PathVariable UUID songId,
			@AuthenticationPrincipal UserPrincipal principal,
			@RequestHeader HttpHeaders headers
	) throws IOException {
		Resource resource = songStreamingService.streamSong(songId, principal);
		MediaType contentType = fileStorageService.contentType(resource);
		List<HttpRange> ranges = headers.getRange();
		if (!ranges.isEmpty()) {
			ResourceRegion region = ranges.getFirst().toResourceRegion(resource);
			return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
					.contentType(contentType)
					.header(HttpHeaders.ACCEPT_RANGES, "bytes")
					.contentLength(region.getCount())
					.body(region);
		}
		return ResponseEntity.ok()
				.contentType(contentType)
				.header(HttpHeaders.ACCEPT_RANGES, "bytes")
				.contentLength(resource.contentLength())
				.body(resource);
	}
}
