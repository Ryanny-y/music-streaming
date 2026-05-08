package com.spotmyfy.backend.shared.file;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {

	private static final Path UPLOAD_ROOT = Path.of("uploads");

	public String storeAudio(MultipartFile file) {
		return store(file, "audio");
	}

	public String storeCover(MultipartFile file) {
		return store(file, "covers");
	}

	public String preparePublicUrl(String objectKey) {
		return objectKey;
	}

	private String store(MultipartFile file, String directory) {
		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
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
			return preparePublicUrl("/uploads/" + directory + "/" + filename);
		} catch (IOException ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store file");
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
}
