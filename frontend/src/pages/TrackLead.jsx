import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function TrackLead() {
  const [trackingId, setTrackingId] = useState("");
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      setError("Please enter your tracking ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setLead(null);
      const response = await api.get(`/leads/track/${trackingId.trim().toUpperCase()}`);
      setLead(response.data.lead);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to find your enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell track-page">
      <header className="topbar">
        <div className="brand">
          <span>LeadDesk Pro</span>
        </div>
        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/admin/login" className="primary">
            Admin Login
          </Link>
        </nav>
      </header>

      <section className="track-card">
        <h1>Track your enquiry</h1>
        <p>Enter your tracking ID to see the latest status, priority, and next steps.</p>

        <form onSubmit={handleTrack}>
          <input
            type="text"
            placeholder="Example: LD-20260724-2VUV"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button type="submit">{loading ? "Searching..." : "Track enquiry"}</button>
        </form>

        {error && <p className="error">{error}</p>}

        {lead && (
          <div className="tracking-result">
            <div className="tracking-header">
              <span>Tracking ID</span>
              <strong>{lead.trackingId}</strong>
            </div>

            <h2>{lead.projectType}</h2>
            <div className={`status-badge ${lead.status?.toLowerCase()}`}>{lead.status}</div>

            <div className="tracking-info">
              <div>
                <span>Priority</span>
                <strong>{lead.priority}</strong>
              </div>
              <div>
                <span>Submitted</span>
                <strong>{new Date(lead.createdAt).toLocaleDateString()}</strong>
              </div>
              <div>
                <span>Last Updated</span>
                <strong>{new Date(lead.updatedAt).toLocaleDateString()}</strong>
              </div>
            </div>

            {lead.projectBrief && (
              <div className="project-brief">
                <h3>Project brief</h3>
                <p>{lead.projectBrief.summary}</p>
                <p>
                  <strong>Estimated complexity:</strong> {lead.projectBrief.estimatedComplexity}
                </p>
                <h4>Recommended services</h4>
                <ul>
                  {lead.projectBrief.recommendedServices?.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default TrackLead;
