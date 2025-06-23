import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IssuePrescription = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId");

  const [patients, setPatients] = useState([]);
  const [prescription, setPrescription] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    instructions: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/patient/getall")
      .then((res) => setPatients(res.data))
      .catch(() => console.log("Failed to load patients"));
  }, []);

  const handleChange = (e) => {
    setPrescription({ ...prescription, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/prescription/insert", {
        ...prescription,
        doctor: { id: doctorId },
        patient: { id: prescription.patientId },
      })
      .then(() => {
        alert("Prescription issued successfully");
        navigate("/doctordashboard");
      })
      .catch(() => alert("Failed to issue prescription"));
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Issue Prescription</h2>
        <form onSubmit={handleSubmit}>
          {/* Select Patient */}
          <div className="mb-3">
            <label className="form-label">Select Patient:</label>
            <select
              name="patientId"
              value={prescription.patientId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Choose...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (ID: {patient.id})
                </option>
              ))}
            </select>
          </div>

          {/* Medication */}
          <div className="mb-3">
            <label className="form-label">Medication:</label>
            <input
              type="text"
              name="medication"
              placeholder="Enter medication"
              value={prescription.medication}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          {/* Dosage */}
          <div className="mb-3">
            <label className="form-label">Dosage:</label>
            <input
              type="text"
              name="dosage"
              placeholder="Enter dosage"
              value={prescription.dosage}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          {/* Instructions */}
          <div className="mb-3">
            <label className="form-label">Instructions:</label>
            <textarea
              name="instructions"
              placeholder="Enter instructions"
              value={prescription.instructions}
              onChange={handleChange}
              required
              className="form-control"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Issue Prescription
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/doctordashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuePrescription;
