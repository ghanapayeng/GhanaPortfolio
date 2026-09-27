package com.ghanapayeng.portfolio.service;

import com.ghanapayeng.portfolio.model.Project;
import com.ghanapayeng.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderBySortOrderAsc();
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderBySortOrderAsc();
    }

    public Optional<Project> getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
}
