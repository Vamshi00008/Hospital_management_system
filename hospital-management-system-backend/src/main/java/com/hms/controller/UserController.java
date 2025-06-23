package com.hms.controller;

import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;



    @PostMapping("/insert")
    public String registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.ADMIN);
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if(existingUser !=null && existingUser.getPassword().equals(existingUser.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", existingUser.getRole());
            response.put("role", existingUser.getRole());

            if (existingUser.getRole().equals("PATIENT")) {
                Patient patient = patientRepository.findByEmail(existingUser.getUsername());
                if (patient != null) {
                    response.put("patientId", patient.getId());
                } else {
                    response.put("patientId", null);
                }
            } else if (existingUser.getRole().equals("DOCTOR")) {
                Doctor doctor = doctorRepository.findByEmail(existingUser.getUsername());
                if (doctor != null) {
                    response.put("doctorId", doctor.getId());
                } else {
                    response.put("doctorId", null);
                }
            } else if (existingUser.getRole().equals("ADMIN")) {
                response.put("adminId", existingUser.getId());
            }
            return ResponseEntity.ok(response);
        }else {
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Failed");
        }
    }

    @GetMapping
    public List<User> getAllUser(){
        return userRepository.findAll();
    }
}
