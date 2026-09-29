package com.hrms.backend.dto;

public class OrganizationDTO {
    private Long id;
    private String name;
    private String address;
    private String contactEmail;

    // Constructors
    public OrganizationDTO() {}

    public OrganizationDTO(Long id, String name, String address, String contactEmail) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.contactEmail = contactEmail;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
}