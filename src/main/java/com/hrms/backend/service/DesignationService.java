package com.hrms.backend.service;

import com.hrms.backend.entity.Designation;
import java.util.List;

public interface DesignationService {
    Designation saveDesignation(Designation designation);
    List<Designation> getAllDesignations();
}