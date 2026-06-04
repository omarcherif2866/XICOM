package com.example.xicombackend.service;

import com.example.xicombackend.entity.Compagne;
import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.CompagneRepository;
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
public class CompagneServiceImp implements CompagneService {

    private final CompagneRepository compagneRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;


    @Override
    public Compagne create(Compagne compagne) {
        Compagne savedCompagne = compagneRepository.save(compagne);

        // Envoyer les emails de manière asynchrone
        sendCompagneConfirmationEmailAsync(savedCompagne);
        sendCompagneNotificationToAdminAsync(savedCompagne);
        return savedCompagne;
    }

    @Override
    public Compagne update(Long id, Compagne compagne) {
        Compagne existing = getById(id);
        compagne.setId(existing.getId());
        return compagneRepository.save(compagne);
    }

    @Override
    public void delete(Long id) {
        compagneRepository.deleteById(id);
    }

    @Override
    public Compagne getById(Long id) {
        return compagneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compagne introuvable : " + id));
    }

    @Override
    public List<Compagne> getAll() {
        return compagneRepository.findAll();
    }


    @Override
    public long count() {
        return compagneRepository.count();
    }

    public void sendCompagneConfirmationEmailAsync(Compagne compagne) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            User user = compagne.getUser();

            helper.setTo(user.getEmail());
            helper.setSubject("✅ Confirmation de votre campagne");

            String htmlContent = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h2 style="color: #7c3aed; margin-top: 0;">✅ Confirmation de votre campagne</h2>
                    <p>Bonjour <strong>%s %s</strong>,</p>
                    <p>Nous avons bien reçu votre campagne et nous vous remercions de votre confiance.</p>

                    <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;">
                        <h3 style="margin-top: 0; color: #7c3aed;">📋 Détails de la campagne</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="padding: 8px 0;">📣 <strong>Nom de la campagne :</strong> %s</li>
                            <li style="padding: 8px 0;">📅 <strong>Date de début :</strong> %s</li>
                            <li style="padding: 8px 0;">📅 <strong>Date de fin :</strong> %s</li>
                            <li style="padding: 8px 0;">💰 <strong>Budget total :</strong> %s €</li>
                            <li style="padding: 8px 0;">🎯 <strong>Cible :</strong> %s</li>
                            <li style="padding: 8px 0;">📡 <strong>Canaux :</strong> %s</li>
                        </ul>
                    </div>

                    <p style="color: #666;">Notre équipe va analyser votre campagne et vous recontactera très prochainement.</p>

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
                    compagne.getNomCampagne(),
                    compagne.getDateDebut(),
                    compagne.getDateFin(),
                    compagne.getBudgetTotal(),
                    compagne.getCible(),
                    compagne.getCanauxCommunication()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de confirmation envoyé : " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Erreur envoi email : " + e.getMessage());
        }
    }

    @Async
    public void sendCompagneNotificationToAdminAsync(Compagne compagne) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            User user = compagne.getUser();

            helper.setTo(adminEmail);
            helper.setSubject("🔔 Nouvelle demande de campagne - " + compagne.getNomCampagne());

            String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #7c3aed; margin-top: 0;">🔔 Nouvelle demande de campagne</h2>
                        <p>Une nouvelle demande de campagne vient d'être enregistrée.</p>

                        <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;">
                            <h3 style="margin-top: 0; color: #7c3aed;">📋 Détails de la campagne</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0;">📣 <strong>Nom de la campagne :</strong> %s</li>
                                <li style="padding: 8px 0;">📅 <strong>Date de début :</strong> %s</li>
                                <li style="padding: 8px 0;">📅 <strong>Date de fin :</strong> %s</li>
                                <li style="padding: 8px 0;">💰 <strong>Budget total :</strong> %s €</li>
                                <li style="padding: 8px 0;">🎯 <strong>Cible :</strong> %s</li>
                                <li style="padding: 8px 0;">📡 <strong>Canaux :</strong> %s</li>
                                <li style="padding: 8px 0;">👤 <strong>Demandeur :</strong> %s %s</li>
                                <li style="padding: 8px 0;">📧 <strong>Email :</strong> %s</li>
                            </ul>
                        </div>

                        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                            <p style="margin: 0; color: #0c5460;">
                                ⚡ <strong>Action requise :</strong> Veuillez contacter le client pour confirmer la campagne.
                            </p>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

                        <p style="color: #888; font-size: 12px; margin-bottom: 0;">
                            Notification automatique - Système de gestion des campagnes
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """,
                    compagne.getNomCampagne(),
                    compagne.getDateDebut(),
                    compagne.getDateFin(),
                    compagne.getBudgetTotal(),
                    compagne.getCible(),
                    compagne.getCanauxCommunication(),
                    user.getName(),
                    user.getSurname(),
                    user.getEmail()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de notification envoyé à l'admin : " + adminEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email à l'admin : " + e.getMessage());
        }
    }
}
