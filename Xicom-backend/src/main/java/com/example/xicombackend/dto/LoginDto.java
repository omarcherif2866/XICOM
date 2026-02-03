package com.example.xicombackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginDto {

    private String email;
    private String password;
}
