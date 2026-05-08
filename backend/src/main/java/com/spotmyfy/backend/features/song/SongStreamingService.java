package com.spotmyfy.backend.features.song;

import com.spotmyfy.backend.features.song.domain.Song;
import com.spotmyfy.backend.features.song.domain.SongStatus;
import com.spotmyfy.backend.features.song.repository.SongRepository;
import com.spotmyfy.backend.shared.file.FileStorageService;
import com.spotmyfy.backend.shared.security.UserPrincipal;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SongStreamingService {

	private final SongRepository songRepository;
	private final FileStorageService fileStorageService;

	public SongStreamingService(SongRepository songRepository, FileStorageService fileStorageService) {
		this.songRepository = songRepository;
		this.fileStorageService = fileStorageService;
	}

	@Transactional(readOnly = true)
	public Resource streamSong(UUID songId, UserPrincipal principal) {
		Song song = songRepository.findById(songId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Song not found"));
		if (song.getStatus() != SongStatus.PUBLISHED && !isAdmin(principal)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Published song not found");
		}
		return fileStorageService.loadAudio(song.getAudioUrl());
	}

	private boolean isAdmin(UserPrincipal principal) {
		if (principal == null) {
			return false;
		}
		return principal.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.anyMatch("ROLE_ADMIN"::equals);
	}
}
