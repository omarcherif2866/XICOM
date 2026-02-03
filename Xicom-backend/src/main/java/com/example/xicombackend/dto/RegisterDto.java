package com.example.xicombackend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class RegisterDto {

    private String username;
    private String email;
    private String password;
    //private String confirmpassword;
    private String phone;
    private Date birthdate;

}
