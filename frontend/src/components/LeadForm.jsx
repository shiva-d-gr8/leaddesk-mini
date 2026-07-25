import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LeadForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budgetRange: "",
    timeline: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess(null);
      const response = await api.post("/leads", formData);
      setSuccess(response.data);
      setFormData({
        name: "",
        email: "",
        projectType: "",
        budgetRange: "",
        timeline: "",
        message: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-card">
        <h2>Enquiry submitted successfully 🎉</h2>
        <p>Your tracking ID is ready.</p>
        <strong>{success.trackingId}</strong>
        <p>Save it to check on your enquiry anytime.</p>
        <button onClick={() => navigate("/track")}>Track your enquiry</button>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <h2>Submit your enquiry</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <select name="projectType" value={formData.projectType} onChange={handleChange} required>
        <option value="">Select project type</option>
        <option value="Website">Website</option>
        <option value="Mobile App">Mobile app</option>
        <option value="SaaS Product">SaaS product</option>
        <option value="AI Application">AI application</option>
        <option value="Custom Software">Custom software</option>
      </select>
      <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} required>
        <option value="">Select budget range</option>
        <option value="Under ₹50,000">Under ₹50,000</option>
        <option value="₹50,000 - ₹2,00,000">₹50,000 - ₹2,00,000</option>
        <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
        <option value="Above ₹5,00,000">Above ₹5,00,000</option>
      </select>
      <select name="timeline" value={formData.timeline} onChange={handleChange} required>
        <option value="">Select timeline</option>
        <option value="Immediately">Immediately</option>
        <option value="Within 1 month">Within 1 month</option>
        <option value="1-3 months">1-3 months</option>
        <option value="3+ months">3+ months</option>
        <option value="Just exploring">Just exploring</option>
      </select>
      <textarea
        name="message"
        placeholder="Tell us about your project..."
        value={formData.message}
        onChange={handleChange}
        required
        minLength={10}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit enquiry"}
      </button>
    </form>
  );
}

export default LeadForm;
