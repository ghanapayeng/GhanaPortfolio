package com.ghanapayeng.portfolio.repository;

import com.ghanapayeng.portfolio.model.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {
    List<VisitorLog> findTop50ByOrderByTimestampDesc();
}
