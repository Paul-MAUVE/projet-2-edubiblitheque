package com.openclassrooms.etudiant.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String jwtSecret;
    
    public String generateToken(UserDetails userDetails) {
        
        byte[] secretBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        SecretKey key = Keys.hmacShaKeyFor(secretBytes);
        return Jwts.builder().subject(userDetails.getUsername()).signWith(key).compact();
    }

}
