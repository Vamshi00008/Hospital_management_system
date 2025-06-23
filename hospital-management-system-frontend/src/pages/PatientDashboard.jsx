import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/appointment/getbypatientid/${patientId}`)
      .then((res) => setAppointments(Array.isArray(res.data) ? res.data : [res.data]))
      .catch(() => alert("Failed to load appointments"));
  }, [patientId]);
  
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCancel = (appointmentId) => {
    axios.put(`http://localhost:8080/api/appointment/update/${appointmentId}`)
      .then(() => {
        alert("Appointment cancelled!");
        setAppointments(
          appointments.map((app) =>
            app.id === appointmentId ? { ...app, status: "CANCELLED" } : app
          )
        );
      })
      .catch(() => alert("Failed to cancel appointment"));
  };

  const patientName = appointments[0]?.patient?.name || "Loading...";

  return (
    <div className="container py-5">
      {/* Navigation Bar */}
      <nav className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded">
        <h2 className="m-0">Patient Dashboard</h2>
        <div className="d-flex align-items-center">
          <FaUserCircle size={28} className="me-2" />
          <span className="me-3 fw-bold">{patientName}</span>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>

      {/* Upcoming Appointments List */}
      <div className="card shadow-lg p-4 rounded-4">
        <h3 className="text-center text-primary fw-bold">Upcoming Appointments</h3>
        <table className="table table-striped mt-3">
          <thead className="table-primary">
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Cancellation</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.doctor?.name}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.status}</td>
                  <td>
                    {appointment.status === "SCHEDULED" ? (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted">Not Available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No upcoming appointments</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-primary px-4 py-2" onClick={() => navigate("/bookappointment")}>Book Appointment</button>
        <button className="btn btn-success px-4 py-2" onClick={() => navigate("/patientprescription")}>View Prescriptions</button>
      </div>
    </div>
  );
};

export default PatientDashboard;