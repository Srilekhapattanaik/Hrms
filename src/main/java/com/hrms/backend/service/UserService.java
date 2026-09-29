package com.hrms.backend.service;

import com.hrms.backend.entity.User;
import java.util.List;

public interface UserService {
    User saveUser(User user);
    List<User> getAllUsers();
}