package com.example.xicombackend.service;

import com.example.xicombackend.entity.Client;
import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.ProjetRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetServiceImp implements ProjetService {

    private final ProjetRepository projetRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Override
    public Client create(Client projet) {
        Client savedProject = projetRepository.save(projet);

        // Envoyer les emails de manière asynchrone
        sendProjectConfirmationEmailAsync(savedProject);
        sendProjectNotificationToAdminAsync(savedProject);
        return savedProject;
    }

    @Override
    public Client update(Long id, Client projet) {
        Client existing = getById(id);
        projet.setId(existing.getId());
        return projetRepository.save(projet);
    }

    @Override
    public void delete(Long id) {
        projetRepository.deleteById(id);
    }

    @Override
    public Client getById(Long id) {
        return projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet introuvable : " + id));
    }

    @Override
    public List<Client> getAll() {
        return projetRepository.findAll();
    }

    @Override
    public long count() {
        return projetRepository.count();
    }

    public void sendProjectConfirmationEmailAsync(Client projet) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            User user = projet.getUser();

            helper.setTo(user.getEmail());
            helper.setSubject("✅ Confirmation de votre projet");

            String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #7c3aed; margin-top: 0;">✅ Confirmation de votre projet</h2>
                        <p>Bonjour <strong>%s %s</strong>,</p>
                        <p>Nous avons bien reçu votre projet et nous vous remercions de votre confiance.</p>

                        <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;">
                            <h3 style="margin-top: 0; color: #7c3aed;">📋 Détails du projet</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0;">🏢 <strong>Client :</strong> %s</li>
                                <li style="padding: 8px 0;">🏭 <strong>Secteur :</strong> %s</li>
                                <li style="padding: 8px 0;">🗂️ <strong>Catégorie :</strong> %s</li>
                                <li style="padding: 8px 0;">📧 <strong>Email :</strong> %s</li>
                                <li style="padding: 8px 0;">📱 <strong>Téléphone :</strong> %s</li>
                            </ul>
                        </div>

                        <p style="color: #666;">Notre équipe va analyser votre projet et vous recontactera très prochainement.</p>

                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

                        <p style="color: #888; font-size: 12px; margin-bottom: 0;">
                            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                        </p>

                        <p style="margin-top: 20px;">Cordialement,<br><strong>L'équipe Xicom</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """,
                    user.getName(),
                    user.getSurname(),
                    projet.getClient(),
                    projet.getSecteur(),
                    projet.getCategorie(),
                    projet.getResponsableEmail(),
                    projet.getResponsableTelephone()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de confirmation envoyé : " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Erreur envoi email : " + e.getMessage());
        }
    }

    @Async
    public void sendProjectNotificationToAdminAsync(Client projet) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            User user = projet.getUser();
            helper.setTo(adminEmail);
            helper.setSubject("🔔 Nouvelle demande de projet - " + projet.getClient());

            String htmlContent = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h2 style="color: #7c3aed; margin-top: 0;">🔔 Nouvelle demande de projet</h2>
                            <p>Une nouvelle demande de projet vient d'être enregistré.</p>
                            
                        <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;">
                            <h3 style="margin-top: 0; color: #7c3aed;">📋 Détails du projet</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0;">🏢 <strong>Client :</strong> %s</li>
                                <li style="padding: 8px 0;">🏭 <strong>Secteur :</strong> %s</li>
                                <li style="padding: 8px 0;">🗂️ <strong>Catégorie :</strong> %s</li>
                                <li style="padding: 8px 0;">📧 <strong>Email :</strong> %s</li>
                                <li style="padding: 8px 0;">📱 <strong>Téléphone :</strong> %s</li>
                            </ul>
                        </div>
                            
                            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                                <p style="margin: 0; color: #0c5460;">
                                    ⚡ <strong>Action requise :</strong> Veuillez contacter le client pour confirmer le projet.
                                </p>
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                            
                            <p style="color: #888; font-size: 12px; margin-bottom: 0;">
                                Notification automatique - Système de gestion des projets
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """,

                    projet.getClient(),
                    projet.getSecteur(),
                    projet.getCategorie(),
                    projet.getResponsableEmail(),
                    projet.getResponsableTelephone()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de notification envoyé à l'admin : " + adminEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email à l'admin : " + e.getMessage());
        }
    }

    @Override
    public List<Client> getByUser(Long userId) {
        return projetRepository.findByUserId(userId);
    }

}
