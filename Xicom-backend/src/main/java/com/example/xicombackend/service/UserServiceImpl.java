package com.example.xicombackend.service;

import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.UserRepository;
import com.example.xicombackend.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    private final JwtProvider jwtProvider;

    private final PasswordEncoder passwordEncoder;

    private final JavaMailSender mailSender;

    private final Map<String, VerificationData> verificationCodes = new ConcurrentHashMap<>();

    // Classe interne pour stocker les données de vérification
    private static class VerificationData {
        String code;
        LocalDateTime expirationTime;
        String email;

        public VerificationData(String code, LocalDateTime expirationTime, String email) {
            this.code = code;
            this.expirationTime = expirationTime;
            this.email = email;
        }
    }

    @Override
    public User updateUser(Integer id, User user){
        User existingUSer = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        existingUSer.setName(user.getName());
        existingUSer.setSurname(user.getSurname());
        existingUSer.setEmail(user.getEmail());

        return userRepository.save(existingUSer);
    }




    @Override
    public User adduser(User users) {
        return userRepository.save(users);
    }

    @Override
    public void deleteUserEntityById(Integer id) {
        userRepository.deleteById(id);

    }


    @Override
    public User getUserById(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.orElse(null);
    }



    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @Override
    public boolean existByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User registerNewUser(User newUser) {
        // Vérifier si un utilisateur avec le même nom d'utilisateur ou la même adresse e-mail existe déjà
        if (userRepository.existsByName(newUser.getName()) || userRepository.existsByEmail(newUser.getEmail())) {
            throw new RuntimeException("User already exists.");
        }

        // Encoder le mot de passe avant de l'enregistrer dans la base de données
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // Enregistrer l'utilisateur dans la base de données
        User savedUser = userRepository.save(newUser);

        return savedUser;
    }


    @Override
    public void blockUser(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            user.setBlocked(true);
            userRepository.save(user);
        });
    }

    @Override
    public void unblockUser(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            user.setBlocked(false);
            userRepository.save(user);
        });
    }

    @Override
    public void changePassword(Integer id, String oldPassword, String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }



        // Enregistrer le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public Map<String, String> sendVerificationCode(String email) {
        // Vérifier si l'email existe
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("Aucun utilisateur trouvé avec cet email.");
        }

        // Générer un code de vérification à 6 chiffres
        String verificationCode = generateVerificationCode();

        // Stocker le code avec une expiration de 15 minutes
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
        verificationCodes.put(user.getId().toString(),
                new VerificationData(verificationCode, expirationTime, email));

        // Envoyer l'email
        sendVerificationEmail(email, verificationCode);

        // Retourner la réponse avec l'ID utilisateur
        Map<String, String> response = new HashMap<>();
        response.put("message", "Code de vérification envoyé avec succès.");
        response.put("userId", user.getId().toString());

        return response;
    }

    @Override
    public void verifyCode(String userId, String code) {
        // Récupérer les données de vérification
        VerificationData verificationData = verificationCodes.get(userId);

        if (verificationData == null) {
            throw new IllegalArgumentException("Aucun code de vérification trouvé. Veuillez demander un nouveau code.");
        }

        // Vérifier l'expiration
        if (LocalDateTime.now().isAfter(verificationData.expirationTime)) {
            verificationCodes.remove(userId);
            throw new IllegalArgumentException("Le code de vérification a expiré. Veuillez demander un nouveau code.");
        }

        // Vérifier le code
        if (!verificationData.code.equals(code)) {
            throw new IllegalArgumentException("Code de vérification incorrect.");
        }

        // Code valide - ne pas supprimer encore, on en aura besoin pour la réinitialisation
    }

    @Override
    public void resetPassword(String userId, String newPassword) {
        // Vérifier que le code a été vérifié
        VerificationData verificationData = verificationCodes.get(userId);

        if (verificationData == null) {
            throw new IllegalArgumentException("Session expirée. Veuillez recommencer le processus.");
        }

        // Vérifier l'expiration
        if (LocalDateTime.now().isAfter(verificationData.expirationTime)) {
            verificationCodes.remove(userId);
            throw new IllegalArgumentException("Session expirée. Veuillez recommencer le processus.");
        }

        // Récupérer l'utilisateur
        User user = userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé."));

        // Valider le nouveau mot de passe
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 6 caractères.");
        }

        // Mettre à jour le mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Supprimer le code de vérification après utilisation
        verificationCodes.remove(userId);
    }

    // Méthode pour générer un code à 6 chiffres
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // Méthode pour envoyer l'email
    private void sendVerificationEmail(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Code de vérification - Réinitialisation du mot de passe");
            message.setText("Bonjour,\n\n" +
                    "Votre code de vérification est : " + code + "\n\n" +
                    "Ce code expirera dans 15 minutes.\n\n" +
                    "Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe KeeJobStore");

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }

    // Méthode optionnelle pour nettoyer les codes expirés périodiquement
    public void cleanupExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        verificationCodes.entrySet().removeIf(entry ->
                now.isAfter(entry.getValue().expirationTime));
    }
}
