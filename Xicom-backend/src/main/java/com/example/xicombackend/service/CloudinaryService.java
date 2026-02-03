package com.example.xicombackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide ou null");
        }

        Map<String, Object> uploadParams = new HashMap<>();
        uploadParams.put("folder", folder);
        uploadParams.put("resource_type", "image");

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

        // ✅ Utiliser secure_url (HTTPS) au lieu de url (HTTP)
        return uploadResult.get("secure_url").toString();
    }

    public String uploadingImage(MultipartFile file) throws IOException {
        return uploadImage(file, "xicom/service");
    }

    /**
     * Upload d'icône
     */
    public String uploadIcon(MultipartFile file, String folder) throws IOException {
        return uploadImage(file, folder);  // ✅ Réutiliser la méthode principale
    }

    public void deleteImage(String imageUrl) throws IOException {
        // Extraire le public_id de l'URL
        String publicId = extractPublicIdFromUrl(imageUrl);
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        // Exemple: https://res.cloudinary.com/xxx/image/upload/v123/formateurs/image.jpg
        String[] parts = imageUrl.split("/");
        String fileNameWithExtension = parts[parts.length - 1];
        String fileName = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));
        return "formateurs/" + fileName;
    }


    public List<String> listIconsFromFolder(String folderName) {
        List<String> iconUrls = new ArrayList<>();

        try {
            // Récupérer toutes les ressources du dossier "icon"
            Map result = cloudinary.api().resources(
                    ObjectUtils.asMap(
                            "type", "upload",
                            "prefix", folderName + "/",  // "icon/"
                            "max_results", 500  // Limite à 500 icônes
                    )
            );

            // Extraire les URLs
            List<Map> resources = (List<Map>) result.get("resources");
            for (Map resource : resources) {
                String url = (String) resource.get("secure_url");
                if (url != null && !url.isEmpty()) {
                    iconUrls.add(url);
                }
            }

            System.out.println("✅ Found " + iconUrls.size() + " icons in folder: " + folderName);

        } catch (Exception e) {
            System.err.println("❌ Error listing icons from Cloudinary: " + e.getMessage());
            e.printStackTrace();
        }

        return iconUrls;
    }

}
