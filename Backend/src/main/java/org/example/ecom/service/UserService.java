package org.example.ecom.service;

import org.example.ecom.exceptions.UserAlreadyExistsException;
import org.example.ecom.model.User;
import org.example.ecom.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * This includes:
 * - User registration (signup)
 * - User authentication (login)
 * - Updating user profile information
 */
@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    /**
     * Registers a new user in the system.
     * Checks whether the username already exists before saving.
     *
     * @param user user object containing registration details
     * @return saved User object
     * @throws RuntimeException if username already exists
     */
    public User register(User user) {
        //check if exists
        repo.findByUsername(user.getUsername())
                .ifPresent(u -> {
                    throw new UserAlreadyExistsException("User already exists!");
                });
        return repo.save(user);
    }

    /**
     * Authenticates a user using username and password.
     *
     * @param username username of the user
     * @param password password entered by the user
     * @return authenticated User object
     * @throws RuntimeException if user does not exist or password is invalid
     */
    public User login(String username, String password) {
        User user = repo.findByUsername(username).orElseThrow(() -> new RuntimeException("user does not exists!"));

        //checking password
        if(!user.getPassword().equals(password)) {
            throw new RuntimeException("password invalid");
        }
        return user;
    }

    /**
     * Updates user profile information.
     *
     * @param id ID of the user to update
     * @param updated user object containing updated fields
     * @return updated User object
     * @throws RuntimeException if user is not found
     */
    public User updateUser(Long id, User updated){
        User user = repo.findById(id).get();

        user.setName(updated.getName());
        user.setPhone(updated.getPhone());
        user.setAddress(updated.getAddress());
        user.setGender(updated.getGender());
        user.setDob(updated.getDob());

        return repo.save(user);
    }

}
