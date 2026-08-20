package com.example.xicombackend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final JavaMailSender mailSender;

    public void sendContactEmail(String nom, String email, String sujet,
                                 String phone, String message) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");

            helper.setTo("hello@xicom.fr");
            helper.setFrom("hello@xicom.fr", nom); // ✅ nom affiché comme expéditeur
            helper.setReplyTo(email);          // ✅ répondre va au client
            helper.setSubject(sujet);
            String htmlContent =
                    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px;'>" +

                            // Header
                            "<div style='background: linear-gradient(135deg, #0059da, #7298d1); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;'>" +
                            "<h1 style='color: white; margin: 0; font-size: 24px;'></h1>" +
                            "<p style='color: rgba(255,255,255,0.85); margin: 8px 0 0;'>Via le formulaire de contact Xicom</p>" +
                            "</div>" +

                            // Body
                            "<div style='background: white; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>" +

                            // Infos client
                            "<table style='width: 100%; border-collapse: collapse; margin-bottom: 24px;'>" +
                            "<tr style='border-bottom: 1px solid #f0f0f0;'>" +
                            "<td style='padding: 12px 0; color: #9ca3af; font-size: 13px; width: 120px;'>👤 Nom</td>" +
                            "<td style='padding: 12px 0; color: #111827; font-weight: 600;'>" + nom + "</td>" +
                            "</tr>" +
                            "<tr style='border-bottom: 1px solid #f0f0f0;'>" +
                            "<td style='padding: 12px 0; color: #9ca3af; font-size: 13px;'>✉️ Email</td>" +
                            "<td style='padding: 12px 0;'>" +
                            "<a href='mailto:" + email + "' style='color: #0059da; text-decoration: none; font-weight: 600;'>" + email + "</a>" +
                            "</td>" +
                            "</tr>" +
                            "<tr style='border-bottom: 1px solid #f0f0f0;'>" +
                            "<td style='padding: 12px 0; color: #9ca3af; font-size: 13px;'>📞 Téléphone</td>" +
                            "<td style='padding: 12px 0; color: #111827; font-weight: 600;'>" + phone + "</td>" +
                            "</tr>" +
                            "</table>" +

                            // Message
                            "<div style='background: #f8faff; border-left: 4px solid #0059da; border-radius: 6px; padding: 20px;'>" +
                            "<p style='color: #9ca3af; font-size: 13px; margin: 0 0 10px;'>💬 Message</p>" +
                            "<p style='color: #111827; line-height: 1.7; margin: 0; white-space: pre-wrap;'>" + message + "</p>" +
                            "</div>" +

                            // Bouton répondre
                            "<div style='text-align: center; margin-top: 28px;'>" +
                            "<a href='mailto:" + email + "' " +
                            "style='background: linear-gradient(135deg, #0059da, #7298d1); color: white; " +
                            "padding: 14px 32px; border-radius: 8px; text-decoration: none; " +
                            "font-weight: 600; font-size: 15px; display: inline-block;'>" +
                            "Répondre à " + nom +
                            "</a>" +
                            "</div>" +

                            "</div>" +

                            // Footer
                            "<p style='text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;'>" +
                            "© 2026 Xicom · Ce mail a été envoyé depuis Xicom.fr" +
                            "</p>" +

                            "</div>";

            helper.setText(htmlContent, true); // ✅ true = HTML activé

            mailSender.send(mime);
        } catch (Exception e) {
            throw new RuntimeException("Erreur envoi mail : " + e.getMessage());
        }
    }
}