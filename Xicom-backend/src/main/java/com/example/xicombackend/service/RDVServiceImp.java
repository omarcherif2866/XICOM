package com.example.xicombackend.service;

import com.example.xicombackend.entity.RDV;
import com.example.xicombackend.repository.RDVRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RDVServiceImp implements RDVService {
    private final RDVRepository rdvRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Override
    public RDV addRDV(RDV rdv) {
        // Sauvegarder le RDV
        RDV savedRDV = rdvRepository.save(rdv);

        // Envoyer les emails de manière asynchrone
        sendRDVConfirmationEmailAsync(savedRDV);
        sendRDVNotificationToAdminAsync(savedRDV);

        return savedRDV;
    }

    @Async
    public void sendRDVConfirmationEmailAsync(RDV rdv) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(rdv.getEmail());
            helper.setSubject("✅ Confirmation de votre rendez-vous");

            String htmlContent = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h2 style="color: #4A90E2; margin-top: 0;">✅ Confirmation de rendez-vous</h2>
                            <p>Bonjour <strong>%s %s</strong>,</p>
                            <p>Nous avons bien reçu votre demande de rendez-vous.</p>
                            
                            <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4A90E2;">
                                <h3 style="margin-top: 0; color: #4A90E2;">📋 Vos informations</h3>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="padding: 8px 0;">📧 <strong>Email :</strong> %s</li>
                                    <li style="padding: 8px 0;">📱 <strong>Téléphone :</strong> %s %s</li>
                                </ul>
                            </div>
                            
                            <p style="color: #666;">Nous vous recontacterons très prochainement pour confirmer la date et l'heure de votre rendez-vous.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                            
                            <p style="color: #888; font-size: 12px; margin-bottom: 0;">
                                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                            </p>
                            
                            <p style="margin-top: 20px;">Cordialement,<br><strong>L'équipe</strong></p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                    rdv.getName(),
                    rdv.getSurname(),
                    rdv.getEmail(),
                    rdv.getCountryCode(),
                    rdv.getNum()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de confirmation envoyé au client : " + rdv.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email au client : " + e.getMessage());
        }
    }

    @Async
    public void sendRDVNotificationToAdminAsync(RDV rdv) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(adminEmail);
            helper.setSubject("🔔 Nouvelle demande de rendez-vous - " + rdv.getName() + " " + rdv.getSurname());

            String htmlContent = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h2 style="color: #E94560; margin-top: 0;">🔔 Nouvelle demande de rendez-vous</h2>
                            <p>Une nouvelle demande de rendez-vous vient d'être enregistrée.</p>
                            
                            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E94560;">
                                <h3 style="margin-top: 0; color: #E94560;">👤 Informations du client</h3>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="padding: 8px 0;"><strong>Nom complet :</strong> %s %s</li>
                                    <li style="padding: 8px 0;"><strong>Email :</strong> <a href="mailto:%s">%s</a></li>
                                    <li style="padding: 8px 0;"><strong>Téléphone :</strong> <a href="tel:%s%s">%s %s</a></li>
                                </ul>
                            </div>
                            
                            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin-top: 20px;">
                                <p style="margin: 0; color: #0c5460;">
                                    ⚡ <strong>Action requise :</strong> Veuillez contacter le client pour confirmer le rendez-vous.
                                </p>
                            </div>
                            
                            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                            
                            <p style="color: #888; font-size: 12px; margin-bottom: 0;">
                                Notification automatique - Système de gestion des RDV
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                    rdv.getName(),
                    rdv.getSurname(),
                    rdv.getEmail(),
                    rdv.getEmail(),
                    rdv.getCountryCode(),
                    rdv.getNum(),
                    rdv.getCountryCode(),
                    rdv.getNum(),
                    rdv.getId()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de notification envoyé à l'admin : " + adminEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email à l'admin : " + e.getMessage());
        }
    }

    @Override
    public RDV updateRDV(Long id, String date, String heure, String lien_reunion) {
        RDV rdv = rdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RDV non trouvé avec l'id : " + id));

        rdv.setDate(date);
        rdv.setHeure(heure);
        rdv.setLien_reunion(lien_reunion);

        RDV updatedRDV = rdvRepository.save(rdv);

        // Envoyer le mail de confirmation au client
        sendRDVUpdateEmailAsync(updatedRDV);

        return updatedRDV;
    }

    @Async
    public void sendRDVUpdateEmailAsync(RDV rdv) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(rdv.getEmail());
            helper.setSubject("📅 Votre rendez-vous est confirmé");

            String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #4A90E2; margin-top: 0;">📅 Votre rendez-vous est confirmé</h2>
                        <p>Bonjour <strong>%s %s</strong>,</p>
                        <p>Votre rendez-vous a été confirmé. Voici les détails :</p>

                        <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4A90E2;">
                            <h3 style="margin-top: 0; color: #4A90E2;">📋 Détails du rendez-vous</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0;">📆 <strong>Date :</strong> %s</li>
                                <li style="padding: 8px 0;">🕐 <strong>Heure :</strong> %s</li>
                                <li style="padding: 8px 0;">🔗 <strong>Lien de la réunion :</strong> <a href="%s" style="color: #4A90E2;">Rejoindre la réunion</a></li>
                            </ul>
                        </div>

                        <p style="color: #666;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>

                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

                        <p style="color: #888; font-size: 12px; margin-bottom: 0;">
                            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                        </p>

                        <p style="margin-top: 20px;">Cordialement,<br><strong>L'équipe</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """,
                    rdv.getName(),
                    rdv.getSurname(),
                    rdv.getDate(),
                    rdv.getHeure(),
                    rdv.getLien_reunion()
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de mise à jour envoyé au client : " + rdv.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email de mise à jour : " + e.getMessage());
        }
    }

    @Override
    public List<RDV> getAllRDV() {
        return rdvRepository.findAll();
    }

    @Override
    public List<RDV> getRDVByClient(String email) {
        return rdvRepository.findByEmail(email);
    }

    @Async
    public void sendReminderEmail(RDV rdv, String delai) {
        try {
            // Email au client
            MimeMessage mimeClient = mailSender.createMimeMessage();
            MimeMessageHelper helperClient = new MimeMessageHelper(mimeClient, true, "UTF-8");
            helperClient.setTo(rdv.getEmail());
            helperClient.setSubject("⏰ Rappel : votre rendez-vous dans " + delai);

            String htmlClient = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #f97316; margin-top: 0;">⏰ Rappel de rendez-vous</h2>
                        <p>Bonjour <strong>%s %s</strong>,</p>
                        <p>Votre rendez-vous est prévu dans <strong>%s</strong>.</p>

                        <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f97316;">
                            <h3 style="margin-top: 0; color: #f97316;">📋 Détails</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0;">📆 <strong>Date :</strong> %s</li>
                                <li style="padding: 8px 0;">🕐 <strong>Heure :</strong> %s</li>
                                <li style="padding: 8px 0;">🔗 <strong>Lien :</strong> <a href="%s" style="color: #f97316;">Rejoindre la réunion</a></li>
                            </ul>
                        </div>

                        <p style="margin-top: 20px;">Cordialement,<br><strong>L'équipe</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """,
                    rdv.getName(), rdv.getSurname(), delai,
                    rdv.getDate(), rdv.getHeure(), rdv.getLien_reunion()
            );
            helperClient.setText(htmlClient, true);
            mailSender.send(mimeClient);

            // Email à l'admin
            MimeMessage mimeAdmin = mailSender.createMimeMessage();
            MimeMessageHelper helperAdmin = new MimeMessageHelper(mimeAdmin, true, "UTF-8");
            helperAdmin.setTo(adminEmail);
            helperAdmin.setSubject("⏰ Rappel RDV dans " + delai + " - " + rdv.getName() + " " + rdv.getSurname());

            String htmlAdmin = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #6863BF; margin-top: 0;">⏰ Rappel RDV dans %s</h2>
                        <p>Le rendez-vous suivant est prévu dans <strong>%s</strong>.</p>

                        <div style="background-color: #f3f0ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #6863BF;">
                            <h3 style="margin-top: 0; color: #6863BF;">👤 Client</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0;"><strong>Nom :</strong> %s %s</li>
                                <li style="padding: 8px 0;"><strong>Email :</strong> %s</li>
                                <li style="padding: 8px 0;"><strong>Téléphone :</strong> %s %s</li>
                                <li style="padding: 8px 0;">📆 <strong>Date :</strong> %s</li>
                                <li style="padding: 8px 0;">🕐 <strong>Heure :</strong> %s</li>
                                <li style="padding: 8px 0;">🔗 <strong>Lien :</strong> <a href="%s" style="color: #6863BF;">Rejoindre</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """,
                    delai, delai,
                    rdv.getName(), rdv.getSurname(),
                    rdv.getEmail(),
                    rdv.getCountryCode(), rdv.getNum(),
                    rdv.getDate(), rdv.getHeure(), rdv.getLien_reunion()
            );
            helperAdmin.setText(htmlAdmin, true);
            mailSender.send(mimeAdmin);

            System.out.println("✅ Rappels envoyés pour RDV id=" + rdv.getId() + " dans " + delai);

        } catch (MessagingException e) {
            System.err.println("❌ Erreur rappel RDV id=" + rdv.getId() + ": " + e.getMessage());
        }
    }

}