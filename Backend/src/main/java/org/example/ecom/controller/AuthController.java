package org.example.ecom.controller;

import org.example.ecom.requestBodyModel.LoginRequest;
import org.example.ecom.model.User;
import org.example.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest data) {
        String username = data.getUsername();
        String password = data.getPassword();

        return userService.login(username, password);
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.register(user);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updated){

        return userService.updateUser(id, updated);
    }

}
