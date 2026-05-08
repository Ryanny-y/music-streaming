package com.spotmyfy.backend.shared.file;

import org.springframework.stereotype.Service;

@Service
public class FileStorageService {

	public String preparePublicUrl(String objectKey) {
		return objectKey;
	}
}
