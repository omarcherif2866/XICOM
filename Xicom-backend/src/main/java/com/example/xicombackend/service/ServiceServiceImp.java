package com.example.xicombackend.service;

import com.example.xicombackend.dto.CommandeRequest;
import com.example.xicombackend.entity.Commande;
import com.example.xicombackend.entity.ServiceEntity;
import com.example.xicombackend.entity.StatusCommande;
import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.CommandeRepository;
import com.example.xicombackend.repository.ServiceRepository;
import com.example.xicombackend.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ServiceServiceImp implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final CommandeRepository commandeRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminEmail;


    @Override
    public ServiceEntity addService(ServiceEntity Services) {
        try {
            return serviceRepository.save(Services);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout de l'Service : Cette Service existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }


    @Override
    public void deleteServiceEntityById(Long id) {
        serviceRepository.deleteById(id);

    }

    @Override
    public ServiceEntity getServiceById(Long id) {
        return serviceRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

    @Override
    public List<ServiceEntity> getAllServices() {
        List<ServiceEntity> ServiceList = serviceRepository.findAll();
        Set<ServiceEntity> ServiceSet = new HashSet<>(ServiceList);

        return new ArrayList<>(ServiceSet);  // ✔ maintenant c’est une List
    }

    @Override
    public ServiceEntity updateService(Long id, ServiceEntity newData) {

        ServiceEntity existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        // 🔹 name
        if (newData.getTitle() != null) {
            existingService.setTitle(newData.getTitle());
        }

        if (newData.getSubTitle() != null) {
            existingService.setSubTitle(newData.getSubTitle());
        }

        // 🔹 description
        if (newData.getIcon() != null) {
            existingService.setIcon(newData.getIcon());
        }

        // 🔹 image
        if (newData.getImage() != null) {
            existingService.setImage(newData.getImage());
        }

        // 🔹 MISE À JOUR DES SECTIONS
        if (newData.getSections() != null && !newData.getSections().isEmpty()) {
            existingService.setSections(newData.getSections());
        }

        if (newData.getPriceSections() != null && !newData.getPriceSections().isEmpty()) {
            existingService.setPriceSections(newData.getPriceSections());
        }

        return serviceRepository.save(existingService);
    }

    @Override
    public Commande commanderService(CommandeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Commande commande = new Commande();
        commande.setServiceTitle(request.getServiceTitle());
        commande.setDetailTitles(request.getDetailTitles());
        commande.setObjectifs(request.getObjectifs());
        commande.setAnalyseSituation(request.getAnalyseSituation());
        commande.setMessageCle(request.getMessageCle());
        commande.setBrief(request.getBrief());
        commande.setDevis(request.getDevis());
        commande.setDelaiSouhaite(request.getDelaiSouhaite());
        commande.setUser(user);

        Commande saved = commandeRepository.save(commande);

        sendCommandeConfirmationEmailAsync(saved);
        sendCommandeNotificationToAdminAsync(saved);

        return saved;
    }

    public void sendCommandeConfirmationEmailAsync(Commande commande) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            User user = commande.getUser();

            String detailsHtml = commande.getDetailTitles().stream()
                    .map(d -> "<li style='padding: 4px 0;'>✔️ " + d + "</li>")
                    .collect(Collectors.joining());

            helper.setTo(user.getEmail());
            helper.setSubject("✅ Confirmation de votre commande");

            String htmlContent = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;'>"
                    + "<div style='background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>"
                    + "<h2 style='color: #7c3aed; margin-top: 0;'>✅ Confirmation de votre commande</h2>"
                    + "<p>Bonjour <strong>" + user.getName() + " " + user.getSurname() + "</strong>,</p>"
                    + "<p>Nous avons bien reçu votre commande et nous vous remercions de votre confiance.</p>"
                    + "<div style='background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;'>"
                    + "<h3 style='margin-top: 0; color: #7c3aed;'>📋 Détails de la commande</h3>"
                    + "<ul style='list-style: none; padding: 0; margin: 0;'>"
                    + "<li style='padding: 8px 0;'>🛠️ <strong>Service :</strong> " + commande.getServiceTitle() + "</li>"
                    + "<li style='padding: 8px 0;'>📌 <strong>Prestations :</strong><ul>" + detailsHtml + "</ul></li>"
                    + "<li style='padding: 8px 0;'>🎯 <strong>Objectifs :</strong> " + commande.getObjectifs() + "</li>"
                    + "<li style='padding: 8px 0;'>📊 <strong>Analyse de la situation :</strong> " + commande.getAnalyseSituation() + "</li>"
                    + "<li style='padding: 8px 0;'>💬 <strong>Message clé :</strong> " + commande.getMessageCle() + "</li>"
                    + "<li style='padding: 8px 0;'>📝 <strong>Brief :</strong> " + commande.getBrief() + "</li>"
                    + "<li style='padding: 8px 0;'>💰 <strong>Devis :</strong> " + commande.getDevis() + "</li>"
                    + "<li style='padding: 8px 0;'>📅 <strong>Délai souhaité :</strong> " + commande.getDelaiSouhaite() + "</li>"
                    + "</ul></div>"
                    + "<p style='color: #666;'>Notre équipe va traiter votre commande et vous recontactera très prochainement.</p>"
                    + "<hr style='border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;'>"
                    + "<p style='color: #888; font-size: 12px; margin-bottom: 0;'>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>"
                    + "<p style='margin-top: 20px;'>Cordialement,<br><strong>L'équipe Xicom</strong></p>"
                    + "</div></div></body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de confirmation envoyé : " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Erreur envoi email : " + e.getMessage());
        }
    }

    @Async
    public void sendCommandeNotificationToAdminAsync(Commande commande) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            User user = commande.getUser();

            String detailsHtml = commande.getDetailTitles().stream()
                    .map(d -> "<li style='padding: 4px 0;'>✔️ " + d + "</li>")
                    .collect(Collectors.joining());

            helper.setTo(adminEmail);
            helper.setSubject("🔔 Nouvelle commande - " + commande.getServiceTitle());

            String htmlContent = "<html><body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                    + "<div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;'>"
                    + "<div style='background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>"
                    + "<h2 style='color: #7c3aed; margin-top: 0;'>🔔 Nouvelle commande reçue</h2>"
                    + "<p>Une nouvelle commande vient d'être enregistrée.</p>"
                    + "<div style='background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;'>"
                    + "<h3 style='margin-top: 0; color: #7c3aed;'>📋 Détails de la commande</h3>"
                    + "<ul style='list-style: none; padding: 0; margin: 0;'>"
                    + "<li style='padding: 8px 0;'>🛠️ <strong>Service :</strong> " + commande.getServiceTitle() + "</li>"
                    + "<li style='padding: 8px 0;'>📌 <strong>Prestations :</strong><ul>" + detailsHtml + "</ul></li>"
                    + "<li style='padding: 8px 0;'>🎯 <strong>Objectifs :</strong> " + commande.getObjectifs() + "</li>"
                    + "<li style='padding: 8px 0;'>📊 <strong>Analyse de la situation :</strong> " + commande.getAnalyseSituation() + "</li>"
                    + "<li style='padding: 8px 0;'>💬 <strong>Message clé :</strong> " + commande.getMessageCle() + "</li>"
                    + "<li style='padding: 8px 0;'>📝 <strong>Brief :</strong> " + commande.getBrief() + "</li>"
                    + "<li style='padding: 8px 0;'>💰 <strong>Devis :</strong> " + commande.getDevis() + "</li>"
                    + "<li style='padding: 8px 0;'>📅 <strong>Délai souhaité :</strong> " + commande.getDelaiSouhaite() + "</li>"
                    + "<li style='padding: 8px 0;'>👤 <strong>Client :</strong> " + user.getName() + " " + user.getSurname() + "</li>"
                    + "<li style='padding: 8px 0;'>📧 <strong>Email :</strong> " + user.getEmail() + "</li>"
                    + "</ul></div>"
                    + "<div style='background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin-top: 20px;'>"
                    + "<p style='margin: 0; color: #0c5460;'>⚡ <strong>Action requise :</strong> Veuillez contacter le client pour traiter la commande.</p>"
                    + "</div>"
                    + "<hr style='border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;'>"
                    + "<p style='color: #888; font-size: 12px; margin-bottom: 0;'>Notification automatique - Système de gestion des commandes</p>"
                    + "</div></div></body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);

            System.out.println("✅ Email de notification envoyé à l'admin : " + adminEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Erreur lors de l'envoi de l'email à l'admin : " + e.getMessage());
        }
    }

    @Override
    public List<Commande> getCommandesByStatus(StatusCommande status) {
        return commandeRepository.findByStatus(status);
    }

}
