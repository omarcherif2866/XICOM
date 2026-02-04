package com.example.xicombackend.service;

import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.UserRepository;
import com.example.xicombackend.security.jwt.JwtProvider;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔐 Code de vérification - Réinitialisation du mot de passe");

            String htmlContent = String.format("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                                
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                            🔐 Réinitialisation du mot de passe
                                        </h1>
                                    </td>
                                </tr>
                                
                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Bonjour,
                                        </p>
                                        
                                        <p style="margin: 0 0 30px; color: #555555; font-size: 15px; line-height: 1.6;">
                                            Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code de vérification ci-dessous pour continuer :
                                        </p>
                                        
                                        <!-- Code Box -->
                                        <table width="100%%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); border-radius: 10px; padding: 25px 40px; display: inline-block;">
                                                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                                                            Votre code de vérification
                                                        </p>
                                                        <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                            %s
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Warning Box -->
                                        <table width="100%%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                            <tr>
                                                <td style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; border-radius: 5px;">
                                                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                                                        ⏱️ <strong>Ce code expirera dans 15 minutes.</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe restera inchangé.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                        <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                                            Cet email a été envoyé par <strong>KeeJobStore</strong>
                                        </p>
                                        <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                            © 2026 KeeJobStore. Tous droits réservés.
                                        </p>
                                    </td>
                                </tr>
                                
                            </table>
                            
                            <!-- Security Note -->
                            <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                                <tr>
                                    <td style="text-align: center; padding: 0 20px;">
                                        <p style="margin: 0; color: #adb5bd; font-size: 12px; line-height: 1.5;">
                                            🔒 Pour votre sécurité, ne partagez jamais ce code avec qui que ce soit.<br>
                                            KeeJobStore ne vous demandera jamais votre mot de passe par email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """, code);

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de vérification envoyé à : " + toEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email : " + e.getMessage());
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
