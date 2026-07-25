import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell admin-login-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-title">LeadDesk Pro</span>
        </div>
        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/track" className="primary">
            Track Enquiry
          </Link>
        </nav>
      </header>

      <section className="auth-panel">
        <div className="auth-card">
          <h1>Admin Sign In</h1>
          <p>Access the admin dashboard to manage leads, update statuses, and stay on top of enquiries.</p>

          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdminLogin;
