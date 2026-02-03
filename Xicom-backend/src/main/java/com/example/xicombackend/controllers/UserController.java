package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.User;
import com.example.xicombackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {

        return ResponseEntity.ok( userService.adduser(user));
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") Integer id) {
        userService.deleteUserEntityById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Integer id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }



    @PutMapping("/block/{userId}")
    public ResponseEntity<Void> blockUser(@PathVariable Integer userId) {
        userService.blockUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/unblock/{userId}")
    public ResponseEntity<Void> unblockUser(@PathVariable Integer userId) {
        userService.unblockUser(userId);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String oldPassword = body.get("oldPassword");
            String newPassword = body.get("newPassword");

            userService.changePassword(id, oldPassword, newPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Mot de passe mis à jour avec succès");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // renvoyer le message dans un JSON avec status 400
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }





}
