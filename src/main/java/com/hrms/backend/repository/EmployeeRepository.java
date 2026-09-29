package com.hrms.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hrms.backend.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}