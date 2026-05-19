package com.example.xicombackend.scheduler;

import com.example.xicombackend.entity.RDV;
import com.example.xicombackend.repository.RDVRepository;
import com.example.xicombackend.service.RDVServiceImp;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RDVReminderScheduler {

    private final RDVRepository rdvRepository;
    private final RDVServiceImp rdvServiceImp;

    @Scheduled(fixedRate = 60000)
    public void sendRDVReminders() {
        List<RDV> rdvList = rdvRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (RDV rdv : rdvList) {
            if (rdv.getDate() == null || rdv.getHeure() == null) continue;

            try {
                LocalDateTime rdvDateTime = LocalDateTime.parse(
                        rdv.getDate() + "T" + rdv.getHeure()
                );

                long minutesUntilRDV = ChronoUnit.MINUTES.between(now, rdvDateTime);

                if (minutesUntilRDV >= 1435 && minutesUntilRDV <= 1440) {
                    rdvServiceImp.sendReminderEmail(rdv, "1 jour");
                }

                if (minutesUntilRDV >= 175 && minutesUntilRDV <= 180) {
                    rdvServiceImp.sendReminderEmail(rdv, "3 heures");
                }

            } catch (Exception e) {
                System.err.println("Erreur parsing date RDV id=" + rdv.getId() + ": " + e.getMessage());
            }
        }
    }
}
