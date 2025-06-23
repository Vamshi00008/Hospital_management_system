import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/doctor/getall")
      .then((res) => setDoctors(res.data))
      .catch(() => alert("Failed to load doctor details"));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0">🏥 JHC</h1>
            <small className="text-light">
              Your trusted healthcare partner
            </small>
          </div>
          <div className="mt-3 mt-md-0">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-light me-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn btn-success"
            >
              Register as Patient
            </button>
          </div>
        </div>
      </header>

      <div
        style={{
          backgroundImage: `url('/images/hospital-background.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          flex: 1,
        }}
      >
        {/* Hero Section */}
        <section className="text-center py-5">
          <div className="container">
            <h2 className="display-5 fw-bold">
              Welcome to the Jeevan Healthcare Center
            </h2>
            <p className="text-muted fs-5">
              Manage your health efficiently with our all-in-one platform for
              doctors, patients, and administrators.
            </p>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="container my-5">
          <h3 className="mb-4 border-bottom pb-2 text-primary">
            Meet Our Doctors
          </h3>
          <div className="row g-4">
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <div key={doc.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body text-center">
                      <div
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          fontSize: "24px",
                        }}
                      >
                        {doc.name.charAt(0)}
                      </div>
                      <h5 className="card-title">{doc.name}</h5>
                      <p className="card-text text-muted mb-1">
                        {doc.specialty}
                      </p>
                      <p className="card-text text-muted small mb-0">
                        📞 {doc.phone}
                      </p>
                      <p className="card-text text-muted small">
                        ✉️ {doc.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center">
                No doctor information available.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <small>
          © {new Date().getFullYear()} Jeevan Healthcare Center. All rights
          reserved.
        </small>
      </footer>
    </div>
  );
};

export default HomePage;
