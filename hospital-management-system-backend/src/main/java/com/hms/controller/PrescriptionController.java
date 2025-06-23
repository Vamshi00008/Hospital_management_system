package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.entity.Prescription;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.AttributeNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/prescription")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public PrescriptionController(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    @PostMapping("/insert")
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }


    @GetMapping("/getall")
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @GetMapping("/getbypatientid/{id}")
    public ResponseEntity<List<Prescription>> getPrescriptionById(@PathVariable Long id) throws AttributeNotFoundException {
        List<Prescription> prescription = prescriptionRepository.findByPatientId(id);

        return prescription.isEmpty() ?
                ResponseEntity.noContent().build() :
                ResponseEntity.ok(prescription);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Boolean>> deletePrescription(@PathVariable Long id) throws AttributeNotFoundException {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new AttributeNotFoundException("Prescription not found with id " + id));
        prescriptionRepository.delete(prescription);

        Map<String, Boolean> response = new HashMap<>();
        response.put("Deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
