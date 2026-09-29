package com.hrms.backend.service;

import com.hrms.backend.entity.Department;
import java.util.List;

public interface DepartmentService {
    Department saveDepartment(Department department);
    List<Department> getAllDepartments();
}