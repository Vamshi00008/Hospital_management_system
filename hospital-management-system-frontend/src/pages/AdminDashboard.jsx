import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/appointment/getall")
      .then((res) => {
        const filteredAppointments = res.data.filter(
          (appt) => appt.status === "SCHEDULED"
        );
        setAppointments(filteredAppointments);
      })
      .catch(() => console.log("Failed to load appointments"));
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/appointment/delete/${appointmentId}`);
      setAppointments((prevAppointments) => prevAppointments.filter(appt => appt.id !== appointmentId));
      alert("Appointment canceled successfully!");
    } catch (error) {
      alert("Failed to cancel appointment");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded p-3">
        <span className="navbar-brand">Admin Dashboard</span>
        <div className="ml-auto">
          <button onClick={() => navigate("/manageappointments")} className="btn btn-primary mx-2">Manage Appointments</button>
          <button onClick={() => navigate("/managepatients")} className="btn btn-primary mx-2">Manage Patients</button>
          <button onClick={() => navigate("/managedoctors")} className="btn btn-primary mx-2">Manage Doctors</button>
          <button onClick={handleLogout} className="btn btn-danger mx-2">Logout</button>
        </div>
      </nav>

      {/* List of Upcoming & Scheduled Appointments */}
      <div className="mt-4">
        <h3 className="mb-3">Upcoming & Scheduled Appointments</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
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
                    <td>{appointment.doctor?.name}</td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">No upcoming or scheduled appointments</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;