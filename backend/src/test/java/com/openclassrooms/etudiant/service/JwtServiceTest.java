package com.openclassrooms.etudiant.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class JwtServiceTest {

    private JwtService jwtService;
    private final String jwtSecret = "01234567890123456789012345678901";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        ReflectionTestUtils.setField(
                jwtService,
                "jwtSecret",
                jwtSecret
        );
    }

        @Test
        void generateToken() {
                // GIVEN
                UserDetails userDetails = User
                        .withUsername("testuser")
                        .password("password")
                        .build();

                // WHEN
                String token = jwtService.generateToken(userDetails);

                // THEN
                assertNotNull(token);

                // GIVEN
                SecretKey key = Keys.hmacShaKeyFor(
                        jwtSecret.getBytes(StandardCharsets.UTF_8)
                );

                // WHEN : lecture du username contenu dans le token
                String username = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject();

                // THEN
                assertEquals("testuser", username);
        }
}