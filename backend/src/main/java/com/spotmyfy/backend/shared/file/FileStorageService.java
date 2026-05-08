package com.spotmyfy.backend.shared.file;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {

	private static final Path UPLOAD_ROOT = Path.of("uploads");
	private static final long MAX_AUDIO_SIZE_BYTES = 50L * 1024L * 1024L;
	private static final long MAX_COVER_SIZE_BYTES = 5L * 1024L * 1024L;
	private static final List<String> ALLOWED_AUDIO_TYPES = List.of(
			"audio/mpeg",
			"audio/mp3",
			"audio/mp4",
			"audio/aac",
			"audio/wav",
			"audio/x-wav",
			"audio/ogg",
			"audio/webm"
	);
	private static final List<String> ALLOWED_COVER_TYPES = List.of(
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
	);

	public String storeAudio(MultipartFile file) {
		return store(file, "audio", MAX_AUDIO_SIZE_BYTES, ALLOWED_AUDIO_TYPES, "/uploads/audio/");
	}

	public String storeCover(MultipartFile file) {
		return store(file, "covers", MAX_COVER_SIZE_BYTES, ALLOWED_COVER_TYPES, "/api/files/covers/");
	}

	public String preparePublicUrl(String objectKey) {
		return objectKey;
	}

	public Resource loadAudio(String storedUrl) {
		String filename = extractFilename(storedUrl, "/uploads/audio/");
		return load("audio", filename);
	}

	public Resource loadCover(String filename) {
		return load("covers", filename);
	}

	public MediaType contentType(Resource resource) {
		try {
			String detectedType = Files.probeContentType(resource.getFile().toPath());
			return detectedType == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.valueOf(detectedType);
		} catch (IOException | IllegalArgumentException ex) {
			return MediaType.APPLICATION_OCTET_STREAM;
		}
	}

	private String store(MultipartFile file, String directory, long maxSizeBytes, List<String> allowedContentTypes, String urlPrefix) {
		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
		}
		if (file.getSize() > maxSizeBytes) {
			throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "File is too large");
		}
		String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
		if (!allowedContentTypes.contains(contentType)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported file type");
		}
		try {
			Path targetDirectory = UPLOAD_ROOT.resolve(directory).normalize();
			Files.createDirectories(targetDirectory);
			String filename = buildFilename(file);
			Path target = targetDirectory.resolve(filename).normalize();
			if (!target.startsWith(targetDirectory)) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
			}
			try (InputStream inputStream = file.getInputStream()) {
				Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
			}
			return preparePublicUrl(urlPrefix + filename);
		} catch (IOException ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
		}
	}

	private Resource load(String directory, String filename) {
		String safeFilename = safeFilename(filename);
		Path targetDirectory = UPLOAD_ROOT.resolve(directory).normalize();
		Path file = targetDirectory.resolve(safeFilename).normalize();
		if (!file.startsWith(targetDirectory)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
		}
		try {
			Resource resource = new UrlResource(file.toUri());
			if (!resource.exists() || !resource.isReadable()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
			}
			return resource;
		} catch (MalformedURLException ex) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file path");
		}
	}

	private String buildFilename(MultipartFile file) {
		String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
		String extension = "";
		int extensionIndex = originalFilename.lastIndexOf('.');
		if (extensionIndex >= 0 && extensionIndex < originalFilename.length() - 1) {
			extension = originalFilename.substring(extensionIndex).toLowerCase(Locale.ROOT);
		}
		return UUID.randomUUID() + extension;
	}

	private String extractFilename(String storedUrl, String expectedPrefix) {
		if (storedUrl == null || storedUrl.isBlank()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio file not found");
		}
		if (!storedUrl.startsWith(expectedPrefix)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Audio file not found");
		}
		return storedUrl.substring(expectedPrefix.length());
	}

	private String safeFilename(String filename) {
		String safeFilename = StringUtils.cleanPath(filename == null ? "" : filename);
		if (safeFilename.isBlank() || safeFilename.contains("/") || safeFilename.contains("\\")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
		}
		return safeFilename;
	}
}
