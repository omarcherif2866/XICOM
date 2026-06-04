package com.example.xicombackend.repository;

import com.example.xicombackend.entity.Livrable;
import com.example.xicombackend.entity.StatusLivrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LivrableRepository extends JpaRepository<Livrable, Long> {
    List<Livrable> findByStatus(StatusLivrable status);

    @Query("SELECT c.livrable FROM Commande c WHERE c.id = :commandeId")
    Optional<Livrable> findByCommandeId(@Param("commandeId") Long commandeId);

    @Query("SELECT DISTINCT c.livrable FROM Commande c WHERE c.user.id = :userId AND c.livrable IS NOT NULL")
    List<Livrable> findByUserId(@Param("userId") Long userId);


}
