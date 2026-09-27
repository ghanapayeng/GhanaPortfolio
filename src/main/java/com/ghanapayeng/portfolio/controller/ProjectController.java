package com.ghanapayeng.portfolio.controller;

import com.ghanapayeng.portfolio.dto.ApiResponse;
import com.ghanapayeng.portfolio.model.Project;
import com.ghanapayeng.portfolio.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.ok("Retrieved all portfolio projects from MySQL", projectService.getAllProjects()));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Project>>> getFeaturedProjects() {
        return ResponseEntity.ok(ApiResponse.ok("Retrieved featured projects (Blood Bridge, URL Shortener)", projectService.getFeaturedProjects()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Project>> getProjectBySlug(@PathVariable String slug) {
        return projectService.getProjectBySlug(slug)
                .map(p -> ResponseEntity.ok(ApiResponse.ok("Project details found", p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        Project saved = projectService.saveProject(project);
        return ResponseEntity.ok(ApiResponse.ok("Project added to MySQL catalog", saved));
    }
}
