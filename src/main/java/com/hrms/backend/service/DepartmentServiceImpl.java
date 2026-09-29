package com.hrms.backend.service;

import com.hrms.backend.entity.Branch;
import com.hrms.backend.entity.Department;
import com.hrms.backend.repository.BranchRepository;
import com.hrms.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final BranchRepository branchRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository, BranchRepository branchRepository) {
        this.departmentRepository = departmentRepository;
        this.branchRepository = branchRepository;
    }

    @Override
    public Department saveDepartment(Department department) {
        if (department.getBranch() != null && department.getBranch().getId() != null) {
            Branch branch = branchRepository.findById(department.getBranch().getId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
            department.setBranch(branch);
        }
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() { return departmentRepository.findAll(); }
}