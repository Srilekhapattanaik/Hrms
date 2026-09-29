package com.hrms.backend.service;

import com.hrms.backend.entity.Organization;
import com.hrms.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @Override
    public Organization saveOrganization(Organization organization) {
        return organizationRepository.save(organization);
    }

    @Override
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    // Adding the missing Update method
    @Override
    public Organization updateOrganization(Long id, Organization orgDetails) {
        Organization existingOrg = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

        existingOrg.setName(orgDetails.getName());
        existingOrg.setAddress(orgDetails.getAddress());
        existingOrg.setContactEmail(orgDetails.getContactEmail());

        return organizationRepository.save(existingOrg);
    }

    // Adding the missing Delete method
    @Override
    public void deleteOrganization(Long id) {
        Organization existingOrg = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        organizationRepository.delete(existingOrg);
    }
}