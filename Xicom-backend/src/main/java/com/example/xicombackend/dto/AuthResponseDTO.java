package com.example.xicombackend.dto;

import com.example.xicombackend.entity.User;
import lombok.Data;

@Data
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer ";
    private User user;

    public AuthResponseDTO(String accessToken, User user) {
        this.accessToken = accessToken;
        this.user = user;

    }


}
