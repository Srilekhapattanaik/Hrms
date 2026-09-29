package com.hrms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hrms.backend.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}