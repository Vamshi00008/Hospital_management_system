package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.AttributeNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;


    public AppointmentController(AppointmentRepository appointmentRepository,
                                 PatientRepository patientRepository,
                                 DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    //for inserting data
    @PostMapping("/insert")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment){
        Patient patient = patientRepository.findById(appointment.getPatient().getId()).orElse(null);
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);

        if(patient == null || doctor == null){
            return ResponseEntity.badRequest().build();
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setStatus(Appointment.Status.SCHEDULED);

        appointmentRepository.save(appointment);
        return ResponseEntity.ok(appointment);
    }

    //for getting appointments that are already there
    @GetMapping("/getall")
    public List<Appointment>getAllAppointment(){
        return appointmentRepository.findAll();
    }


    //for getting appointments based on id
    @GetMapping("/getbypatientid/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }


    @GetMapping("/getbydoctorid/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    }


    //for getting appointments that are scheduled
    @GetMapping("/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentByStatus(@RequestParam Appointment appointment){
        List<Appointment> appointments = appointmentRepository.findByStatus(Appointment.Status.SCHEDULED);
        return ResponseEntity.ok(appointments);
    }

    //for deleting an appointment
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Boolean>>deleteAppointment(@PathVariable long id) throws AttributeNotFoundException {
       Appointment appointment = appointmentRepository.findById(id).orElseThrow(()-> new AttributeNotFoundException("Appointment not found with id " + id));
       appointmentRepository.delete(appointment);
       Map<String,Boolean> response = new HashMap<String , Boolean>();
       response.put("Deleted", Boolean.TRUE);
       return ResponseEntity.ok(response);
    }

    //for cancelling an appointment
    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelAppointment(@PathVariable long id) throws AttributeNotFoundException {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointment.get().setStatus(Appointment.Status.CANCELLED);
            appointmentRepository.save(appointment.get());
            return ResponseEntity.ok("Appointment cancelled successfully");
        } else {
            return ResponseEntity.status(404).body("Appointment not found!");
        }
    }


    // Update Appointment Status
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateAppointmentStatus(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointment.get().setStatus(Appointment.Status.COMPLETED);
            appointmentRepository.save(appointment.get());
            return ResponseEntity.ok("Appointment status updated!");
        } else {
            return ResponseEntity.status(404).body("Appointment not found!");
        }
    }

    @PutMapping("/statusupdate/{id}")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointment.get().setStatus(Appointment.Status.valueOf(status.toString()));
            appointmentRepository.save(appointment.get());
            return ResponseEntity.ok("Appointment status updated!");
        } else {
            return ResponseEntity.status(404).body("Appointment not found!");
        }
    }

}

