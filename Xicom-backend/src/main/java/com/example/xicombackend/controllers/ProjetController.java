package com.example.xicombackend.controllers;

import com.example.xicombackend.entity.Client;
import com.example.xicombackend.entity.ProduitItem;
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

    // ===== CREATE =====
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("client") String client,
            @RequestParam("secteur") String secteur,
            @RequestParam("categorie") String categorie,
            @RequestParam("responsableNomPrenom") String responsableNomPrenom,
            @RequestParam("responsableAdresse") String responsableAdresse,
            @RequestParam("responsableTelephone") String responsableTelephone,
            @RequestParam("responsableEmail") String responsableEmail,
            @RequestParam(value = "couleurANePasUtiliser", required = false) String couleurANePasUtiliser,
            @RequestParam(value = "autresDonnees", required = false) String autresDonnees,
            @RequestParam(value = "autresCommentaires", required = false) String autresCommentaires,
            @RequestParam(value = "siteWeb", required = false) String siteWeb,
            @RequestParam(value = "reseauxSociaux", required = false) List<String> reseauxSociaux,
            @RequestParam(value = "coordonnees", required = false) String coordonnees,
            @RequestParam(value = "canauxContact", required = false) List<String> canauxContact,
            @RequestParam(value = "servicesReconnusOutils", required = false) String servicesReconnusOutils,
            @RequestParam(value = "concurrent", required = false) String concurrent,

            // Fichiers identité visuelle
            @RequestParam(value = "logo", required = false) List<MultipartFile> logo,
            @RequestParam(value = "avatars", required = false) List<MultipartFile> avatars,
            @RequestParam(value = "charteGraphique", required = false) List<MultipartFile> charteGraphique,
            @RequestParam(value = "policesCaracteres", required = false) List<MultipartFile> policesCaracteres,
            @RequestParam(value = "imagesIllustrations", required = false) List<MultipartFile> imagesIllustrations,
            @RequestParam(value = "couleurSecondaire", required = false) List<MultipartFile> couleurSecondaire,

            // Produits — textes JSON sérialisés + fichiers images séparés
            // Frontend envoie produitX_items = JSON array de {type,value} où value="" pour les images
            // et produitX_files = les fichiers dans l'ordre des slots "image"
            @RequestParam(value = "produit1Items", required = false) String produit1Items,
            @RequestParam(value = "produit1Files", required = false) List<MultipartFile> produit1Files,
            @RequestParam(value = "produit2Items", required = false) String produit2Items,
            @RequestParam(value = "produit2Files", required = false) List<MultipartFile> produit2Files,
            @RequestParam(value = "produit3Items", required = false) String produit3Items,
            @RequestParam(value = "produit3Files", required = false) List<MultipartFile> produit3Files,
            @RequestParam(value = "produit4Items", required = false) String produit4Items,
            @RequestParam(value = "produit4Files", required = false) List<MultipartFile> produit4Files,
            @RequestParam(value = "produit5Items", required = false) String produit5Items,
            @RequestParam(value = "produit5Files", required = false) List<MultipartFile> produit5Files,

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
            projet.setCouleurANePasUtiliser(couleurANePasUtiliser != null ? couleurANePasUtiliser : "");
            projet.setAutresDonnees(autresDonnees != null ? autresDonnees : "");
            projet.setAutresCommentaires(autresCommentaires != null ? autresCommentaires : "");
            projet.setSiteWeb(siteWeb != null ? siteWeb : "");
            projet.setReseauxSociaux(reseauxSociaux != null ? reseauxSociaux : new ArrayList<>());
            projet.setCoordonnees(coordonnees != null ? coordonnees : "");
            projet.setCanauxContact(canauxContact != null ? canauxContact : new ArrayList<>());
            projet.setServicesReconnusOutils(servicesReconnusOutils != null ? servicesReconnusOutils : "");
            projet.setConcurrent(concurrent != null ? concurrent : "");

            // Upload identité visuelle
            projet.setLogo(uploadList(logo, "xicom/projet/logo"));
            projet.setAvatars(uploadList(avatars, "xicom/projet/avatars"));
            projet.setCharteGraphique(uploadList(charteGraphique, "xicom/projet/charte"));
            projet.setPolicesCaracteres(uploadList(policesCaracteres, "xicom/projet/polices"));
            projet.setImagesIllustrations(uploadList(imagesIllustrations, "xicom/projet/images"));
            projet.setCouleurSecondaire(uploadList(couleurSecondaire, "xicom/projet/couleurSecondaire"));

            // Upload produits (texte + images mélangés)
            projet.setProduit1(buildProduitItems(produit1Items, produit1Files, "xicom/projet/produit1"));
            projet.setProduit2(buildProduitItems(produit2Items, produit2Files, "xicom/projet/produit2"));
            projet.setProduit3(buildProduitItems(produit3Items, produit3Files, "xicom/projet/produit3"));
            projet.setProduit4(buildProduitItems(produit4Items, produit4Files, "xicom/projet/produit4"));
            projet.setProduit5(buildProduitItems(produit5Items, produit5Files, "xicom/projet/produit5"));

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

    // ===== UPDATE =====
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
            @RequestParam(value = "couleurANePasUtiliser", required = false) String couleurANePasUtiliser,
            @RequestParam(value = "autresDonnees", required = false) String autresDonnees,
            @RequestParam(value = "autresCommentaires", required = false) String autresCommentaires,
            @RequestParam(value = "siteWeb", required = false) String siteWeb,
            @RequestParam(value = "reseauxSociaux", required = false) List<String> reseauxSociaux,
            @RequestParam(value = "coordonnees", required = false) String coordonnees,
            @RequestParam(value = "canauxContact", required = false) List<String> canauxContact,
            @RequestParam(value = "servicesReconnusOutils", required = false) String servicesReconnusOutils,
            @RequestParam(value = "concurrent", required = false) String concurrent,

            // Nouveaux fichiers identité visuelle
            @RequestParam(value = "logo", required = false) List<MultipartFile> logo,
            @RequestParam(value = "avatars", required = false) List<MultipartFile> avatars,
            @RequestParam(value = "charteGraphique", required = false) List<MultipartFile> charteGraphique,
            @RequestParam(value = "policesCaracteres", required = false) List<MultipartFile> policesCaracteres,
            @RequestParam(value = "imagesIllustrations", required = false) List<MultipartFile> imagesIllustrations,
            @RequestParam(value = "couleurSecondaire", required = false) List<MultipartFile> couleurSecondaire,

            // Produits — items JSON + nouveaux fichiers
            @RequestParam(value = "produit1Items", required = false) String produit1Items,
            @RequestParam(value = "produit1Files", required = false) List<MultipartFile> produit1Files,
            @RequestParam(value = "produit2Items", required = false) String produit2Items,
            @RequestParam(value = "produit2Files", required = false) List<MultipartFile> produit2Files,
            @RequestParam(value = "produit3Items", required = false) String produit3Items,
            @RequestParam(value = "produit3Files", required = false) List<MultipartFile> produit3Files,
            @RequestParam(value = "produit4Items", required = false) String produit4Items,
            @RequestParam(value = "produit4Files", required = false) List<MultipartFile> produit4Files,
            @RequestParam(value = "produit5Items", required = false) String produit5Items,
            @RequestParam(value = "produit5Files", required = false) List<MultipartFile> produit5Files,

            // URLs existantes à conserver — identité visuelle
            @RequestParam(value = "logoExisting", required = false) List<String> logoExisting,
            @RequestParam(value = "avatarsExisting", required = false) List<String> avatarsExisting,
            @RequestParam(value = "charteGraphiqueExisting", required = false) List<String> charteGraphiqueExisting,
            @RequestParam(value = "policesCaracteresExisting", required = false) List<String> policesCaracteresExisting,
            @RequestParam(value = "imagesIllustrationsExisting", required = false) List<String> imagesIllustrationsExisting,
            @RequestParam(value = "couleurSecondaireExisting", required = false) List<String> couleurSecondaireExisting
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
            projet.setCouleurANePasUtiliser(couleurANePasUtiliser != null ? couleurANePasUtiliser : "");
            projet.setAutresDonnees(autresDonnees != null ? autresDonnees : "");
            projet.setAutresCommentaires(autresCommentaires != null ? autresCommentaires : "");
            projet.setSiteWeb(siteWeb != null ? siteWeb : "");
            projet.setReseauxSociaux(reseauxSociaux != null ? reseauxSociaux : new ArrayList<>());
            projet.setCoordonnees(coordonnees != null ? coordonnees : "");
            projet.setCanauxContact(canauxContact != null ? canauxContact : new ArrayList<>());
            projet.setServicesReconnusOutils(servicesReconnusOutils != null ? servicesReconnusOutils : "");
            projet.setConcurrent(concurrent != null ? concurrent : "");

            // Fusionner existants + nouveaux — identité visuelle
            projet.setLogo(mergeList(logoExisting, logo, "xicom/projet/logo"));
            projet.setAvatars(mergeList(avatarsExisting, avatars, "xicom/projet/avatars"));
            projet.setCharteGraphique(mergeList(charteGraphiqueExisting, charteGraphique, "xicom/projet/charte"));
            projet.setPolicesCaracteres(mergeList(policesCaracteresExisting, policesCaracteres, "xicom/projet/polices"));
            projet.setImagesIllustrations(mergeList(imagesIllustrationsExisting, imagesIllustrations, "xicom/projet/images"));
            projet.setCouleurSecondaire(mergeList(couleurSecondaireExisting, couleurSecondaire, "xicom/projet/couleurSecondaire"));

            // Produits — items JSON contient déjà les existants + nouveaux slots vides pour les fichiers
            projet.setProduit1(buildProduitItems(produit1Items, produit1Files, "xicom/projet/produit1"));
            projet.setProduit2(buildProduitItems(produit2Items, produit2Files, "xicom/projet/produit2"));
            projet.setProduit3(buildProduitItems(produit3Items, produit3Files, "xicom/projet/produit3"));
            projet.setProduit4(buildProduitItems(produit4Items, produit4Files, "xicom/projet/produit4"));
            projet.setProduit5(buildProduitItems(produit5Items, produit5Files, "xicom/projet/produit5"));

            return ResponseEntity.ok(projetService.create(projet));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite : " + e.getMessage());
        }
    }

    // ===== UTILITAIRES =====

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

    private List<String> mergeList(List<String> existing, List<MultipartFile> newFiles, String folder) throws IOException {
        List<String> urls = new ArrayList<>(existing != null ? existing : new ArrayList<>());
        urls.addAll(uploadList(newFiles, folder));
        return urls;
    }

    /**
     * Reconstruit la liste de ProduitItem à partir de :
     *   - itemsJson : JSON array de {type, value} envoyé par le frontend.
     *                 Pour les items "image" à uploader, value doit être "" ou null.
     *                 Pour les items "image" déjà uploadés (update), value contient l'URL Cloudinary.
     *                 Pour les items "text", value contient le texte.
     *   - files     : fichiers dans l'ordre des slots image dont value est vide.
     */
    private List<ProduitItem> buildProduitItems(
            String itemsJson,
            List<MultipartFile> files,
            String folder
    ) throws IOException {
        List<ProduitItem> result = new ArrayList<>();
        if (itemsJson == null || itemsJson.isBlank()) return result;

        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        List<ProduitItem> items;
        try {
            items = mapper.readValue(itemsJson,
                    mapper.getTypeFactory().constructCollectionType(List.class, ProduitItem.class));
        } catch (Exception e) {
            return result;
        }

        int fileIndex = 0;
        List<MultipartFile> safeFiles = files != null ? files : new ArrayList<>();

        for (ProduitItem item : items) {
            if ("image".equals(item.getType())) {
                if (item.getValue() != null && !item.getValue().isBlank()) {
                    // Image déjà uploadée (cas update) — on conserve l'URL
                    result.add(item);
                } else if (fileIndex < safeFiles.size()) {
                    // Nouveau fichier à uploader
                    MultipartFile file = safeFiles.get(fileIndex++);
                    if (file != null && !file.isEmpty()) {
                        String url = cloudinaryService.uploadImage(file, folder);
                        result.add(new ProduitItem("image", url));
                    }
                }
                // Si pas de fichier dispo pour ce slot, on skip (item ignoré)
            } else {
                // type "text" — on garde tel quel
                result.add(item);
            }
        }
        return result;
    }

    // ===== AUTRES ENDPOINTS =====
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