package com.hms.controller;

import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.PatientRepository;
import java.util.Map;

import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.management.AttributeNotFoundException;
import java.util.HashMap;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
   private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    //registering patients
    @PostMapping("/insert")
    public ResponseEntity<String> registerPatient(@RequestBody Patient patient) {
        if(patientRepository.findByEmail(patient.getEmail()) != null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Patient with this email already exists");
        }
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        // Save patient details in the Patient table
        patientRepository.save(patient);

        // Create a User record with the patient’s email and password
        User user = new User();
        user.setUsername(patient.getEmail());
        user.setPassword(passwordEncoder.encode(patient.getPassword()));
        user.setRole(User.Role.PATIENT);

        userRepository.save(user);

        return ResponseEntity.ok("Patient registered successfully");
    }


    @GetMapping("/getall")
    public List<Patient>getAllPatient(){
        return patientRepository.findAll();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Boolean>>deletePatient(@PathVariable long id) throws AttributeNotFoundException {
       Patient patient =  patientRepository.findById(id).orElseThrow(()->new AttributeNotFoundException("Patient not found with id" + id));
       patientRepository.delete(patient);
       Map<String, Boolean> response = new HashMap<String, Boolean>();
       return ResponseEntity.ok(response);
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<Patient>GetPatientById(@PathVariable long id) throws AttributeNotFoundException {
        Patient patient =  patientRepository.findById(id).orElseThrow(()->new AttributeNotFoundException("Patient not found with id" + id));
        return  ResponseEntity.ok(patient);
    }

    // Updating patient details
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) throws AttributeNotFoundException {
        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() -> new AttributeNotFoundException("Patient not found with id " + id));

        // Update fields
        existingPatient.setName(updatedPatient.getName());
        existingPatient.setAge(updatedPatient.getAge());
        existingPatient.setBlood(updatedPatient.getBlood());
        existingPatient.setEmail(updatedPatient.getEmail());
        existingPatient.setGender(updatedPatient.getGender());
        existingPatient.setAddress(updatedPatient.getAddress());
        existingPatient.setNumber(updatedPatient.getNumber());

        // Only update password if it's not null or empty
        if (updatedPatient.getPassword() != null && !updatedPatient.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(updatedPatient.getPassword());
            existingPatient.setPassword(encodedPassword);

            // Update password in User table as well
            User user = userRepository.findByUsername(existingPatient.getEmail());
            if (user != null) {
                user.setPassword(encodedPassword);
                userRepository.save(user);
            }
        }

        patientRepository.save(existingPatient);
        return ResponseEntity.ok("Patient updated successfully");
    }

}
