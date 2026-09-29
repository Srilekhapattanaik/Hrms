package com.hrms.backend.service;

import com.hrms.backend.entity.Department;
import com.hrms.backend.entity.Designation;
import com.hrms.backend.repository.DepartmentRepository;
import com.hrms.backend.repository.DesignationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DesignationServiceImpl implements DesignationService {
    private final DesignationRepository designationRepository;
    private final DepartmentRepository departmentRepository;

    public DesignationServiceImpl(DesignationRepository designationRepository, DepartmentRepository departmentRepository) {
        this.designationRepository = designationRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public Designation saveDesignation(Designation designation) {
        if (designation.getDepartment() != null && designation.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(designation.getDepartment().getId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
            designation.setDepartment(dept);
        }
        return designationRepository.save(designation);
    }

    @Override
    public List<Designation> getAllDesignations() { return designationRepository.findAll(); }
}