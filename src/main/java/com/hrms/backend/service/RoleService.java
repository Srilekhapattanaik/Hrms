package com.hrms.backend.service;

import com.hrms.backend.entity.Role;
import java.util.List;

public interface RoleService {
    Role saveRole(Role role);
    List<Role> getAllRoles();
}