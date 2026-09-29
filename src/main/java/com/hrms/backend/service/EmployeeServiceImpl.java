package com.hrms.backend.service;

import com.hrms.backend.entity.Employee;
import com.hrms.backend.entity.Organization;
import com.hrms.backend.repository.EmployeeRepository;
import com.hrms.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final OrganizationRepository organizationRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, OrganizationRepository organizationRepository) {
        this.employeeRepository = employeeRepository;
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        if (employee.getOrganization() != null && employee.getOrganization().getId() != null) {
            Organization org = organizationRepository.findById(employee.getOrganization().getId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
            employee.setOrganization(org);
        }
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() { return employeeRepository.findAll(); }
}