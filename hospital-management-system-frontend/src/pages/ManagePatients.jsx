import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagePatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedPatient, setEditedPatient] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/patient/getall")
      .then((res) => setPatients(res.data))
      .catch(() => alert("Failed to load patients"));
  }, []);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedPatient({ ...patients[index] });
  };

  const handleInputChange = (e) => {
    setEditedPatient({ ...editedPatient, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put(
        `http://localhost:8080/api/patient/update/${editedPatient.id}`,
        editedPatient
      )
      .then((res) => {
        const updated = { ...patients[editIndex], ...res.data };
        const updatedPatients = [...patients];
        updatedPatients[editIndex] = updated;

        setPatients(updatedPatients);
        setEditIndex(null);
        setEditedPatient({});
        alert("Patient updated successfully");
      })
      .catch(() => alert("Failed to update patient"));
  };

  const handleDelete = (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    axios
      .delete(`http://localhost:8080/api/patient/delete/${patientId}`)
      .then(() => {
        const updatedList = patients.filter((p) => p.id !== patientId);
        setPatients(updatedList);
        alert("Patient deleted successfully");
      })
      .catch(() => alert("Failed to delete patient"));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded">
        <h3>Manage Patients</h3>
        <button
          onClick={() => navigate("/admindashboard")}
          className="btn btn-light"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="table-secondary">
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Blood Group</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? ( patients.map((p, i) => (
              <tr key={p.id || i}>
                <td>
                  {editIndex === i ? (
                    <input
                      name="name"
                      value={editedPatient.name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editIndex === i ? (
                    <input
                      name="age"
                      value={editedPatient.age}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    p.age
                  )}
                </td>
                <td>
                  {editIndex === i ? (
                    <select
                      name="gender"
                      value={editedPatient.gender}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    p.gender
                  )}
                </td>
                <td>{p.email}</td>
                <td>
                  {editIndex === i ? (
                    <select
                      name="blood"
                      value={editedPatient.blood}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option>
                      <option>AB+</option><option>AB-</option>
                    </select>
                  ) : (
                    p.blood
                  )}
                </td>
                <td>
                  {editIndex === i ? (
                    <input
                      name="number"
                      value={editedPatient.number}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    p.number
                  )}
                </td>
                <td>
                  {editIndex === i ? (
                    <input
                      name="address"
                      value={editedPatient.address}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    p.address
                  )}
                </td>
                <td>
                  {editIndex === i ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditIndex(null); setEditedPatient({}); }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(i)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))):(
              <tr>
                <td colSpan="8" className="text-center">No patients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePatients;
