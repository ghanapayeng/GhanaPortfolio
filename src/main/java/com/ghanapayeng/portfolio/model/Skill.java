package com.ghanapayeng.portfolio.model;

import jakarta.persistence.*;

/**
 * JPA Entity representing skills and proficiencies.
 * Persisted in MySQL table: skills
 */
@Entity
@Table(
    name = "skills",
    indexes = {
        @Index(name = "idx_skill_category", columnList = "category")
    }
)
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // BACKEND, DATABASE, FRONTEND, TOOLS

    @Column(nullable = false)
    private int proficiency; // 1-100

    @Column(name = "icon_url", length = 255)
    private String iconUrl;

    public Skill() {
    }

    public Skill(String name, String category, int proficiency, String iconUrl) {
        this.name = name;
        this.category = category;
        this.proficiency = proficiency;
        this.iconUrl = iconUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getProficiency() {
        return proficiency;
    }

    public void setProficiency(int proficiency) {
        this.proficiency = proficiency;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
