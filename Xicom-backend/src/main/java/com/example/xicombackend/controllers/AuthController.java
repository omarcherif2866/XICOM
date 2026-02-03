package com.example.xicombackend.controllers;

import com.example.xicombackend.dto.AuthResponseDTO;
import com.example.xicombackend.dto.LoginDto;
import com.example.xicombackend.dto.MessageResponse;
import com.example.xicombackend.entity.Role;
import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.UserRepository;
import com.example.xicombackend.security.jwt.JwtProvider;
import com.example.xicombackend.security.jwt.usersecurity.UserPrinciple;
import com.example.xicombackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/auth")
    //@CrossOrigin(origins = "http://localhost:4200")
    public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final PasswordEncoder passwordEncoder;
        private final JwtProvider jwtProvider;
        private final UserRepository userRepository;

        private final UserService userService;





        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
            // Récupérer l'utilisateur par son nom d'utilisateur ou email
            var account = userRepository.findByNameOrEmail(loginDto.getEmail(), loginDto.getEmail()).orElse(null);

            // Vérifier si l'utilisateur existe
            if (account == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect");
            }

            // Vérifier si l'utilisateur est bloqué
            if (account.isBlocked()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Votre compte est bloqué. Contactez l'administrateur pour plus d'informations.");
            }

            // Authentifier l'utilisateur
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginDto.getEmail(),
                                loginDto.getPassword()
                        )
                );
            } catch (AuthenticationException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect"+loginDto.getEmail());
            }

            // Générer le token JWT
            String jwtToken = jwtProvider.generateToken(UserPrinciple.build(account));

            // Récupérer le rôle à partir du token JWT
            String role = jwtProvider.getRoleFromJwt(jwtToken);
            System.out.println("Rôle :" + role);

            // Retourner le token JWT et le rôle dans la réponse
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", jwtToken);
            response.put("role", role);

            return ResponseEntity.ok(response);
        }


        

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody User User) {
            try {
                if (userRepository.existsByName(User.getName())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: name is already taken!"));
                }
                if (userRepository.existsByName(User.getSurname())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: surname is already taken!"));
                }
                if (userRepository.existsByEmail(User.getEmail())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
                }

                // Encode the password before saving it to the database
                User.setPassword(passwordEncoder.encode(User.getPassword()));

                // Set default role to USER
                User.setRole(Role.SIMPLEU);
                User.setBlocked(false);

                // Save the user to the database
                User savedUser = userRepository.save(User);

                // Convert User to UserPrinciple
                UserPrinciple userPrinciple = UserPrinciple.build(savedUser);

                // Generate JWT token for the registered user
                String token = jwtProvider.generateToken(userPrinciple);
                System.out.println(savedUser);

                // Return the JWT token and user details to the client
                return ResponseEntity.ok(new AuthResponseDTO(token, savedUser));
            } catch (RuntimeException e) {
                // If an exception occurs, it may mean that the user already exists
                return ResponseEntity.badRequest().body(new MessageResponse("Failed to register user: " + e.getMessage()));
            }
        }

        @PutMapping("/{id}")
        public User updateUserPut(@PathVariable Integer id , @RequestBody User user)
        {
            return userService.updateUser(id,user);
        }


        @PostMapping("/forgot")
        public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
            try {
                String email = request.get("email");
                Map<String, String> response = userService.sendVerificationCode(email);
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Erreur interne."));
            }
        }

        @PostMapping("/verify-code")
        public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
            try {
                String userId = request.get("userId");
                String code = request.get("code");
                userService.verifyCode(userId, code);
                return ResponseEntity.ok(Map.of("message", "Code vérifié avec succès."));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la vérification du code."));
            }
        }

        @PostMapping("/reset")
        public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
            try {
                String userId = request.get("userId");
                String newPassword = request.get("newPassword");
                userService.resetPassword(userId, newPassword);
                return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès."));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la réinitialisation."));
            }
        }

}