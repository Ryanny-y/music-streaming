package com.spotmyfy.backend.features.history.repository;

import com.spotmyfy.backend.features.history.domain.ListeningHistory;
import com.spotmyfy.backend.features.user.domain.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, UUID> {

	List<ListeningHistory> findByUserOrderByPlayedAtDesc(User user);
}
