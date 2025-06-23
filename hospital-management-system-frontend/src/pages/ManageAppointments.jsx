import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/appointment/getall")
      .then((res) => setAppointments(res.data))
      .catch(() => console.log("Failed to load appointments"));
  }, []);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/appointment/delete/${appointmentId}`
      );
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt.id !== appointmentId)
      );
      alert("Appointment deleted successfully!");
    } catch (error) {
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="container mt-4">
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-dark rounded mb-4 p-3 d-flex justify-content-between">
        <h2 className="text-white">Manage Appointments</h2>
        <button
          onClick={() => navigate("/admindashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </nav>

      {/* List of All Appointments */}
      <div className="card shadow p-4">
        <h3 className="mb-3">All Appointments</h3>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
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
                  <td>{appointment.patient?.name || "N/A"}</td>
                  <td>{appointment.doctor?.name || "N/A"}</td>
                  <td>
                    {appointment.appointmentDate
                      ? new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{appointment.status || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No appointments available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAppointments;
