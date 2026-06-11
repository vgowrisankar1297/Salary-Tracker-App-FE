package com.salarytracker.backend.service;

import com.salarytracker.backend.dto.AuthResponse;
import com.salarytracker.backend.dto.LoginRequest;
import com.salarytracker.backend.dto.RefreshTokenRequest;
import com.salarytracker.backend.dto.RegisterRequest;
import com.salarytracker.backend.model.User;
import com.salarytracker.backend.repository.UserRepository;
import com.salarytracker.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public User registerUser(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }

    public AuthResponse loginUser(LoginRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Invalid username or email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId());
        String refreshToken = tokenProvider.generateRefreshToken();

        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs()));
        userRepository.save(user);

        return new AuthResponse(accessToken, refreshToken, user.getId(), user.getUsername(), user.getEmail());
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (user.getRefreshTokenExpiry().isBefore(Instant.now())) {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiry(null);
            userRepository.save(user);
            throw new RuntimeException("Refresh token was expired. Please log in again.");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getId());
        String newRefreshToken = tokenProvider.generateRefreshToken();

        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiry(Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs()));
        userRepository.save(user);

        return new AuthResponse(accessToken, newRefreshToken, user.getId(), user.getUsername(), user.getEmail());
    }

    public void logoutUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRefreshToken(null);
        user.setRefreshTokenExpiry(null);
        userRepository.save(user);
    }
}
