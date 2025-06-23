import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const patientId = localStorage.getItem("patientId");

  const appointmentData = {
    patient: { id: patientId },
    doctor: { id: selectedDoctor },
    appointmentDate: appointmentDate,
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctor/getall")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDoctors(res.data);
        } else {
          setMessage("Failed to load doctors");
        }
      })
      .catch(() => {
        setMessage("Failed to fetch doctors");
      })
      .finally(() => setLoading(false));
  }, []);

  const bookAppointment = () => {
    if (!selectedDoctor) {
      setMessage("Please select a doctor");
      return;
    }

    axios
      .post("http://localhost:8080/api/appointment/insert", appointmentData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        alert("Appointment booked successfully");
        navigate("/patientdashboard");
      })
      .catch(() => alert("Failed to book appointment"));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "400px", background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", color: "black" }}>
        <h2 className="text-center mb-4 fw-bold">Book Appointment</h2>

        {message && <p className="text-center text-danger fw-bold">{message}</p>}

        <div className="mb-3">
          <label className="form-label fw-bold">Select Doctor:</label>
          <select className="form-select rounded-pill p-2 border-0 shadow-sm" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
            <option value="">Select Doctor</option>
            {loading ? (
              <option disabled>Loading doctors...</option>
            ) : doctors.length > 0 ? (
              doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} - {doc.specialty}
                </option>
              ))
            ) : (
              <option disabled>No doctors available</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Select Date:</label>
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="form-control rounded-pill p-2 border-0 shadow-sm" />
        </div>

        <button className="btn btn-primary w-100 fw-bold shadow-sm rounded-pill mb-2" onClick={bookAppointment}>
          Book Appointment
        </button>

        <button onClick={() => navigate("/patientdashboard")} className="btn btn-secondary w-100 fw-bold shadow-sm rounded-pill">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Appointment;
