package org.example.ecom.service;

import org.example.ecom.model.User;
import org.example.ecom.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    //signup
    public User register(User user) {
        //check if exists
        repo.findByUsername(user.getUsername())
                .ifPresent(u -> {
                    throw new RuntimeException("User already exists!");
                });
        user.setRole("USER");
        return repo.save(user);
    }

    //login
    public User login(String username, String password) {
        User user = repo.findByUsername(username).orElseThrow(() -> new RuntimeException("user does not exists!"));

        //checking password
        if(!user.getPassword().equals(password)) {
            throw new RuntimeException("password invalid");
        }
        return user;
    }
}
