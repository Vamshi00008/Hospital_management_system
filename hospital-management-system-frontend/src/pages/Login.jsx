import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    loginUser(username, password)
      .then((res) => {
        const { token, role, patientId, doctorId, adminId } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "PATIENT") {
          localStorage.setItem("patientId", patientId);
          navigate("/PatientDashboard");
        } else if (role === "DOCTOR") {
          localStorage.setItem("doctorId", doctorId);
          navigate("/DoctorDashboard");
        } else if (role === "ADMIN") {
          localStorage.setItem("adminId", adminId);
          navigate("/AdminDashboard");
        }
      })
      .catch(() => setError("Invalid username or password"));
  };

  return (
    <><button
      className="btn btn-outline-primary position-absolute top-0 start-0 m-3"
      onClick={() => navigate("/")}
    >
      ⬅ Back to Home
    </button><div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow-lg rounded-4 text-center" style={{ width: "400px", background: "#f8f9fa" }}>
          <h2 className="mb-4 fw-bold text-primary">Login</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white"><FaUser /></span>
            <input
              type="text"
              className="form-control p-2 border-0 shadow-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white"><FaLock /></span>
            <input
              type="password"
              className="form-control p-2 border-0 shadow-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button
            className="btn btn-primary w-100 fw-bold shadow-sm rounded-pill"
            onClick={handleLogin}>
            Login
          </button>

          <p className="mt-3">
            Don't have an account?
            <a href="#!" className="text-primary fw-bold" onClick={() => navigate("/Register")}>
              Register here
            </a>
          </p>
        </div>
      </div></>
  );
};

export default Login;
