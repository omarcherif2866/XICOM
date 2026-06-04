package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Client;
import com.example.xicombackend.entity.User;
import com.example.xicombackend.repository.UserRepository;
import com.example.xicombackend.service.CloudinaryService;
import com.example.xicombackend.service.ProjetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/projet")
@RequiredArgsConstructor
public class ProjetController {

    private final ProjetService projetService;
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("client") String client,
            @RequestParam("secteur") String secteur,
            @RequestParam("categorie") String categorie,
            @RequestParam("responsableNomPrenom") String responsableNomPrenom,
            @RequestParam("responsableAdresse") String responsableAdresse,
            @RequestParam("responsableTelephone") String responsableTelephone,
            @RequestParam("responsableEmail") String responsableEmail,
            @RequestParam("couleurSecondaire") String couleurSecondaire,
            @RequestParam("couleurANePasUtiliser") String couleurANePasUtiliser,
            @RequestParam("autresDonnees") String autresDonnees,
            @RequestParam("autresCommentaires") String autresCommentaires,
            @RequestParam("siteWeb") String siteWeb,
            @RequestParam("reseauxSociaux") String reseauxSociaux,
            @RequestParam("coordonnees") String coordonnees,
            @RequestParam("canauxContact") String canauxContact,
            @RequestParam("servicesReconnusOutils") String servicesReconnusOutils,
            @RequestParam("concurrent") String concurrent,
            @RequestParam("programmeFidelite") String programmeFidelite,
            @RequestParam("hobbiesMarque") String hobbiesMarque,
            @RequestParam("consommation") String consommation,
            @RequestParam("achatsRealises") String achatsRealises,
            @RequestParam("frequenceAchat") String frequenceAchat,
            @RequestParam("moyenPaiement") String moyenPaiement,
            @RequestParam("pagesConsultees") String pagesConsultees,
            @RequestParam("produitsPlusVisites") String produitsPlusVisites,

            // Champs avec liste d'images
            @RequestParam(value = "logo", required = false) List<MultipartFile> logo,
            @RequestParam(value = "avatars", required = false) List<MultipartFile> avatars,
            @RequestParam(value = "charteGraphique", required = false) List<MultipartFile> charteGraphique,
            @RequestParam(value = "policesCaracteres", required = false) List<MultipartFile> policesCaracteres,
            @RequestParam(value = "imagesIllustrations", required = false) List<MultipartFile> imagesIllustrations,
            @RequestParam(value = "lesProduits", required = false) List<MultipartFile> lesProduits,
            @RequestParam(value = "lesAvis", required = false) List<MultipartFile> lesAvis,
            @RequestParam(value = "lesPublications", required = false) List<MultipartFile> lesPublications,

            @RequestParam("userId") Integer userId

            ) {
        try {
            Client projet = new Client();

            projet.setClient(client);
            projet.setSecteur(secteur);
            projet.setCategorie(categorie);
            projet.setResponsableNomPrenom(responsableNomPrenom);
            projet.setResponsableAdresse(responsableAdresse);
            projet.setResponsableTelephone(responsableTelephone);
            projet.setResponsableEmail(responsableEmail);
            projet.setCouleurSecondaire(couleurSecondaire);
            projet.setCouleurANePasUtiliser(couleurANePasUtiliser);
            projet.setAutresDonnees(autresDonnees);
            projet.setAutresCommentaires(autresCommentaires);
            projet.setSiteWeb(siteWeb);
            projet.setReseauxSociaux(reseauxSociaux);
            projet.setCoordonnees(coordonnees);
            projet.setCanauxContact(canauxContact);
            projet.setServicesReconnusOutils(servicesReconnusOutils);
            projet.setConcurrent(concurrent);
            projet.setProgrammeFidelite(programmeFidelite);
            projet.setHobbiesMarque(hobbiesMarque);
            projet.setConsommation(consommation);
            projet.setAchatsRealises(achatsRealises);
            projet.setFrequenceAchat(frequenceAchat);
            projet.setMoyenPaiement(moyenPaiement);
            projet.setPagesConsultees(pagesConsultees);
            projet.setProduitsPlusVisites(produitsPlusVisites);

            // Upload listes d'images
            projet.setLogo(uploadList(logo, "xicom/projet/logo"));
            projet.setAvatars(uploadList(avatars, "xicom/projet/avatars"));
            projet.setCharteGraphique(uploadList(charteGraphique, "xicom/projet/charte"));
            projet.setPolicesCaracteres(uploadList(policesCaracteres, "xicom/projet/polices"));
            projet.setImagesIllustrations(uploadList(imagesIllustrations, "xicom/projet/images"));
            projet.setLesProduits(uploadList(lesProduits, "xicom/projet/produits"));
            projet.setLesAvis(uploadList(lesAvis, "xicom/projet/avis"));
            projet.setLesPublications(uploadList(lesPublications, "xicom/projet/publications"));
            User user = userRepository.findById(userId).orElse(null);
            projet.setUser(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(projetService.create(projet));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite : " + e.getMessage());
        }
    }

    // Méthode utilitaire
    private List<String> uploadList(List<MultipartFile> files, String folder) throws IOException {
        List<String> urls = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    urls.add(cloudinaryService.uploadImage(file, folder));
                }
            }
        }
        return urls;
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam("client") String client,
            @RequestParam("secteur") String secteur,
            @RequestParam("categorie") String categorie,
            @RequestParam("responsableNomPrenom") String responsableNomPrenom,
            @RequestParam("responsableAdresse") String responsableAdresse,
            @RequestParam("responsableTelephone") String responsableTelephone,
            @RequestParam("responsableEmail") String responsableEmail,
            @RequestParam("couleurSecondaire") String couleurSecondaire,
            @RequestParam("couleurANePasUtiliser") String couleurANePasUtiliser,
            @RequestParam("autresDonnees") String autresDonnees,
            @RequestParam("autresCommentaires") String autresCommentaires,
            @RequestParam("siteWeb") String siteWeb,
            @RequestParam("reseauxSociaux") String reseauxSociaux,
            @RequestParam("coordonnees") String coordonnees,
            @RequestParam("canauxContact") String canauxContact,
            @RequestParam("servicesReconnusOutils") String servicesReconnusOutils,
            @RequestParam("concurrent") String concurrent,
            @RequestParam("programmeFidelite") String programmeFidelite,
            @RequestParam("hobbiesMarque") String hobbiesMarque,
            @RequestParam("consommation") String consommation,
            @RequestParam("achatsRealises") String achatsRealises,
            @RequestParam("frequenceAchat") String frequenceAchat,
            @RequestParam("moyenPaiement") String moyenPaiement,
            @RequestParam("pagesConsultees") String pagesConsultees,
            @RequestParam("produitsPlusVisites") String produitsPlusVisites,

            // Nouveaux fichiers
            @RequestParam(value = "logo", required = false) List<MultipartFile> logo,
            @RequestParam(value = "avatars", required = false) List<MultipartFile> avatars,
            @RequestParam(value = "charteGraphique", required = false) List<MultipartFile> charteGraphique,
            @RequestParam(value = "policesCaracteres", required = false) List<MultipartFile> policesCaracteres,
            @RequestParam(value = "imagesIllustrations", required = false) List<MultipartFile> imagesIllustrations,
            @RequestParam(value = "lesProduits", required = false) List<MultipartFile> lesProduits,
            @RequestParam(value = "lesAvis", required = false) List<MultipartFile> lesAvis,
            @RequestParam(value = "lesPublications", required = false) List<MultipartFile> lesPublications,

            // URLs existantes à conserver
            @RequestParam(value = "logoExisting", required = false) List<String> logoExisting,
            @RequestParam(value = "avatarsExisting", required = false) List<String> avatarsExisting,
            @RequestParam(value = "charteGraphiqueExisting", required = false) List<String> charteGraphiqueExisting,
            @RequestParam(value = "policesCaracteresExisting", required = false) List<String> policesCaracteresExisting,
            @RequestParam(value = "imagesIllustrationsExisting", required = false) List<String> imagesIllustrationsExisting,
            @RequestParam(value = "lesProduitsExisting", required = false) List<String> lesProduitsExisting,
            @RequestParam(value = "lesAvisExisting", required = false) List<String> lesAvisExisting,
            @RequestParam(value = "lesPublicationsExisting", required = false) List<String> lesPublicationsExisting
    ) {
        try {
            Client projet = projetService.getById(id);

            projet.setClient(client);
            projet.setSecteur(secteur);
            projet.setCategorie(categorie);
            projet.setResponsableNomPrenom(responsableNomPrenom);
            projet.setResponsableAdresse(responsableAdresse);
            projet.setResponsableTelephone(responsableTelephone);
            projet.setResponsableEmail(responsableEmail);
            projet.setCouleurSecondaire(couleurSecondaire);
            projet.setCouleurANePasUtiliser(couleurANePasUtiliser);
            projet.setAutresDonnees(autresDonnees);
            projet.setAutresCommentaires(autresCommentaires);
            projet.setSiteWeb(siteWeb);
            projet.setReseauxSociaux(reseauxSociaux);
            projet.setCoordonnees(coordonnees);
            projet.setCanauxContact(canauxContact);
            projet.setServicesReconnusOutils(servicesReconnusOutils);
            projet.setConcurrent(concurrent);
            projet.setProgrammeFidelite(programmeFidelite);
            projet.setHobbiesMarque(hobbiesMarque);
            projet.setConsommation(consommation);
            projet.setAchatsRealises(achatsRealises);
            projet.setFrequenceAchat(frequenceAchat);
            projet.setMoyenPaiement(moyenPaiement);
            projet.setPagesConsultees(pagesConsultees);
            projet.setProduitsPlusVisites(produitsPlusVisites);

            // Fusionner existants + nouveaux uploads
            projet.setLogo(mergeList(logoExisting, logo, "xicom/projet/logo"));
            projet.setAvatars(mergeList(avatarsExisting, avatars, "xicom/projet/avatars"));
            projet.setCharteGraphique(mergeList(charteGraphiqueExisting, charteGraphique, "xicom/projet/charte"));
            projet.setPolicesCaracteres(mergeList(policesCaracteresExisting, policesCaracteres, "xicom/projet/polices"));
            projet.setImagesIllustrations(mergeList(imagesIllustrationsExisting, imagesIllustrations, "xicom/projet/images"));
            projet.setLesProduits(mergeList(lesProduitsExisting, lesProduits, "xicom/projet/produits"));
            projet.setLesAvis(mergeList(lesAvisExisting, lesAvis, "xicom/projet/avis"));
            projet.setLesPublications(mergeList(lesPublicationsExisting, lesPublications, "xicom/projet/publications"));

            return ResponseEntity.ok(projetService.create(projet));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite : " + e.getMessage());
        }
    }

    // Méthode utilitaire — fusionne URLs existantes + nouveaux fichiers uploadés
    private List<String> mergeList(List<String> existing, List<MultipartFile> newFiles, String folder) throws IOException {
        List<String> urls = new ArrayList<>(existing != null ? existing : new ArrayList<>());
        urls.addAll(uploadList(newFiles, folder));
        return urls;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projetService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAll() {
        return ResponseEntity.ok(projetService.getAll());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(projetService.count());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Client>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(projetService.getByUser(userId));
    }
}