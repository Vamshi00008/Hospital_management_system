import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Appointment from "./pages/Appointment";
import ViewPatientPrescriptions from "./pages/ViewPatientPrescription";
import IssuePrescription from "./pages/IssuePrescription";
import ManageAppointments from "./pages/ManageAppointments";
import ManagePatients from "./pages/ManagePatients";
import DoctorManagement from "./pages/DoctorManagement";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/patientdashboard"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookappointment"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctordashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patientprescription"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <ViewPatientPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issue-prescription/:appointmentId"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <IssuePrescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageappointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managepatients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManagePatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managedoctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DoctorManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
