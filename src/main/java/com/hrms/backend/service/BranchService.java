package com.hrms.backend.service;

import com.hrms.backend.entity.Branch;
import java.util.List;

public interface BranchService {
    Branch saveBranch(Branch branch);
    List<Branch> getAllBranches();
}