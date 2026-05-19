package com.example.xicombackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ← ajoute cette annotation
@EnableAsync(proxyTargetClass = true)  // ← ajoute proxyTargetClass = true
public class XicomBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(XicomBackendApplication.class, args);
    }

}
