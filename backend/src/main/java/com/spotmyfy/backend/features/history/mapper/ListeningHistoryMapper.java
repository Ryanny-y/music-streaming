package com.spotmyfy.backend.features.history.mapper;

import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import com.spotmyfy.backend.features.history.dto.ListeningHistoryResponse;
import com.spotmyfy.backend.features.song.mapper.SongMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = SongMapper.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ListeningHistoryMapper {

	@Mapping(target = "id", source = "historyId")
	@Mapping(target = "song", source = "song")
	ListeningHistoryResponse toResponse(ListeningHistory listeningHistory);
}
