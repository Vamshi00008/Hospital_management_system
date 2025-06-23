import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewPatientPrescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);

  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/prescription/getbypatientid/${patientId}`)
      .then((res) =>{
        const data = (Array.isArray(res.data) ? res.data : [res.data]);
      console.log(prescriptions);
      setPrescriptions(data);}
      )
      .catch(() => alert("Failed to load prescriptions"));
  }, [patientId]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg rounded-4" style={{ width: "600px" }}>
        <h2 className="text-center mb-4 fw-bold">Your Prescriptions</h2>

        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Doctor</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Instruction</th>
              </tr>
            </thead>

            <tbody>
  {Array.isArray(prescriptions) && prescriptions.length > 0 ? (
    prescriptions.map((prescription, index) => (
      <tr key={prescription.id || index}>
        <td>{prescription.doctor?.name || "N/A"}</td>
        <td>{prescription.medication || "N/A"}</td>
        <td>{prescription.dosage || "N/A"}</td>
        <td>{prescription.instructions || "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center text-danger fw-bold">
        No prescriptions found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>

        <button
          onClick={() => navigate("/patientdashboard")}
          className="btn btn-secondary mt-3 fw-bold w-100"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewPatientPrescriptions;
