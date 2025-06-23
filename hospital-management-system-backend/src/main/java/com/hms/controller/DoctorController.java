package com.hms.controller;

import com.hms.entity.Doctor;
import com.hms.entity.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.management.AttributeNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/doctor")
public class DoctorController {


    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/insert")
    public ResponseEntity<String> createDoctor(@RequestBody Doctor doctor){
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        doctorRepository.save(doctor);

        User user = new User();
        user.setUsername(doctor.getEmail());
        user.setPassword(passwordEncoder.encode(doctor.getPassword()));
        user.setRole(User.Role.DOCTOR);

        userRepository.save(user);

        return ResponseEntity.ok("Doctor registered successfully");
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Doctor>> getAllDoctor(){
        List<Doctor> doctors = doctorRepository.findAll();
        if (doctors.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) throws AttributeNotFoundException {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new AttributeNotFoundException("Doctor not found with id " + id));

        doctor.setName(doctorDetails.getName());
        doctor.setEmail(doctorDetails.getEmail());
        doctor.setSpecialty(doctorDetails.getSpecialty());
        doctor.setPhone(doctorDetails.getPhone());
        Doctor updatedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Boolean>>deleteDoctor(@PathVariable long id) throws AttributeNotFoundException {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(()-> new AttributeNotFoundException("Appointment not found with id " + id));
        doctorRepository.delete(doctor);
        Map<String,Boolean> response = new HashMap<String , Boolean>();
        response.put("Deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
