import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/appointment/getbydoctorid/${doctorId}`)
      .then((res) => setAppointments(res.data))
      .catch(() => console.log("Failed to load appointments"));
  }, [doctorId]);

  const handleStatus = (appointmentId, newStatus) => {
    axios
      .put(`http://localhost:8080/api/appointment/statusupdate/${appointmentId}?status=${newStatus}`)
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
        alert("Status updated successfully!");
      })
      .catch(() => alert("Failed to update status"));
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow">
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-dark rounded mb-4">
        <span className="navbar-brand mb-0 h4">Doctor Dashboard</span>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </nav>

      {/* View Appointments List */}
      <h3 className="mb-3">Appointments</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patient?.name}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatus(appointment.id, e.target.value)}
                      className="form-select"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      {/* <option value="CANCELLED">Cancelled</option> */}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/issue-prescription/${appointment.id}`)}
                      className="btn btn-success btn-sm"
                    >
                      Issue Prescription
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No appointments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
