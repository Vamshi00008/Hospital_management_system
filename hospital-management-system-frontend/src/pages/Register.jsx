import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTransgender,
  FaMapMarkerAlt,
  FaPhone,
  FaTint,
  FaCalendar,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    blood: "",
    email: "",
    gender: "",
    password: "",
    address: "",
    number: "",
  });

  const [message, setMessage] = useState({
    error: "",
    success: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/patient/insert", formData);
      setMessage({
        success: "Registration successful! Redirecting...",
        error: "",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({
        error: "Username already exists or failed to register",
        success: "",
      });
    }
  };

  return (
    <><button
      className="btn btn-outline-primary position-absolute top-0 start-0 m-3"
      onClick={() => navigate("/")}
    >
      ⬅ Back to Home
    </button><div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card p-4 shadow-lg rounded-4 text-center"
          style={{ width: "400px", background: "#f8f9fa" }}
        >
          <h2 className="mb-4 fw-bold text-primary">Register</h2>
          {message.error && (
            <p className="text-center text-danger fw-bold">{message.error}</p>
          )}
          {message.success && (
            <p className="text-center text-success fw-bold">{message.success}</p>
          )}

          <form onSubmit={handleRegister}>
            {[
              ["name", "Full Name", FaUser],
              ["age", "Age", FaCalendar],
              ["blood", "Blood Group", FaTint],
              ["email", "Email", FaEnvelope],
              ["gender", "Gender", FaTransgender],
              ["password", "Password", FaLock],
              ["address", "Address", FaMapMarkerAlt],
              ["number", "Mobile Number", FaPhone],
            ].map(([name, placeholder, Icon]) => (
              <div className="input-group mb-3" key={name}>
                <span className="input-group-text bg-primary text-white">
                  <Icon />
                </span>

                {name === "gender" ? (
                  <select
                    name="gender"
                    className="form-select p-2 border-0 shadow-sm"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : name === "blood" ? (
                  <select
                    name="blood"
                    className="form-select p-2 border-0 shadow-sm"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                ) : (
                  <input
                    type={name === "password" ? "password" : "text"}
                    name={name}
                    className="form-control p-2 border-0 shadow-sm"
                    placeholder={placeholder}
                    onChange={handleChange}
                    required />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold shadow-sm rounded-pill"
            >
              Register
            </button>
          </form>
        </div>
      </div></>
  );
};

export default Register;
