package org.example.ecom.controller;

import org.example.ecom.model.User;
import org.example.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private UserService service;

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        return service.login(username, password);
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return service.register(user);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updated){

        return service.updateUser(id, updated);
    }

}
