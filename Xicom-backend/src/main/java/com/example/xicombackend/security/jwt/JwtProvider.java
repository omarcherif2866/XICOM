package com.example.xicombackend.security.jwt;

import com.example.xicombackend.security.jwt.usersecurity.UserPrinciple;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtProvider {
    @Value("${project.sec.jwtSecret}")
    private String jwtSecret;

    @Value("${project.sec.jwtExpiration}")
    private int jwtExpiration;

    public String generateToken(UserPrinciple userPrinciple) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration * 1000);

        return Jwts.builder()
                .setSubject(userPrinciple.getUsername())
                .claim("id", userPrinciple.getId())
                .claim("role", userPrinciple.getRole())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getRoleFromJwt(String token) {
        Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
        return (String) claims.get("role");
    }
    public String getUserNameFromJWt(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwt(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException | ExpiredJwtException e) {
            // Gérer les exceptions de manière appropriée
            return false;
        }
    }
}
