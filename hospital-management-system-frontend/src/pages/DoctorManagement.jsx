import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedDoctor, setEditedDoctor] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios
      .get("http://localhost:8080/api/doctor/getall")
      .then((res) => setDoctors(res.data))
      .catch(() => alert("Failed to fetch doctors"));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/doctor/delete/${id}`)
      .then(() => fetchDoctors())
      .catch(() => alert("Failed to delete doctor"));
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setEditedDoctor({ ...doctor });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedDoctor({});
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/api/doctor/update/${editingId}`, editedDoctor)
      .then(() => {
        fetchDoctors();
        setEditingId(null);
        setEditedDoctor({});
      })
      .catch(() => alert("Failed to update doctor"));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = () => {
    axios
      .post("http://localhost:8080/api/doctor/insert", newDoctor)
      .then(() => {
        fetchDoctors();
        setShowAddForm(false);
        setNewDoctor({
          name: "",
          email: "",
          password: "",
          specialty: "",
          phone: "",
        });
      })
      .catch(() => alert("Failed to add doctor"));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded">
        <h3>Manage Doctors</h3>
        <div>
          <button
            className="btn btn-light me-2"
            onClick={() => navigate("/admindashboard")}
          >
            Back to Dashboard
          </button>
          <button
            className="btn btn-light"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "Add New Doctor"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card mt-4 p-4">
          <div className="row g-3">
            {["name", "email", "password", "specialty", "phone"].map(
              (field) => (
                <div className="col-md-6" key={field}>
                  <input
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newDoctor[field]}
                    onChange={handleAddChange}
                    className="form-control"
                  />
                </div>
              )
            )}
            <div className="col-12">
              <button
                onClick={handleAddDoctor}
                className="btn btn-success w-100"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="table-secondary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((d) => (
                <tr key={d.id}>
                  <td>
                    {editingId === d.id ? (
                      <input
                        name="name"
                        value={editedDoctor.name || ""}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    ) : (
                      d.name || "N/A"
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        name="email"
                        value={editedDoctor.email || ""}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    ) : (
                      d.email || "N/A"
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        name="specialty"
                        value={editedDoctor.specialty || ""}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    ) : (
                      d.specialty || "N/A"
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        name="phone"
                        value={editedDoctor.phone || ""}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    ) : (
                      d.phone || "N/A"
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleUpdate}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(d.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement;
