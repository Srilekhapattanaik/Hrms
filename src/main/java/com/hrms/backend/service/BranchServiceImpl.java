package com.hrms.backend.service;

import com.hrms.backend.entity.Branch;
import com.hrms.backend.entity.Organization;
import com.hrms.backend.repository.BranchRepository;
import com.hrms.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BranchServiceImpl implements BranchService {
    private final BranchRepository branchRepository;
    private final OrganizationRepository organizationRepository;

    public BranchServiceImpl(BranchRepository branchRepository, OrganizationRepository organizationRepository) {
        this.branchRepository = branchRepository;
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Branch saveBranch(Branch branch) {
        if (branch.getOrganization() != null && branch.getOrganization().getId() != null) {
            Organization org = organizationRepository.findById(branch.getOrganization().getId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
            branch.setOrganization(org);
        }
        return branchRepository.save(branch);
    }

    @Override
    public List<Branch> getAllBranches() { return branchRepository.findAll(); }
}