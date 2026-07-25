import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const [leadResponse, activityResponse] = await Promise.all([
          api.get(`/leads/${id}`),
          api.get(`/leads/${id}/activity`),
        ]);
        setLead(leadResponse.data.lead);
        setActivities(activityResponse.data.activities);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        } else {
          setError(error.response?.data?.message || "Failed to load lead details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDetails();
  }, [id, navigate]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await api.patch(`/leads/${id}/status`, { status: newStatus });
      setLead(response.data.lead);
      const activityResponse = await api.get(`/leads/${id}/activity`);
      setActivities(activityResponse.data.activities);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status.");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      setNoteLoading(true);
      const response = await api.post(`/leads/${id}/notes`, { text: note });
      setLead(response.data.lead);
      setNote("");
      const activityResponse = await api.get(`/leads/${id}/activity`);
      setActivities(activityResponse.data.activities);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add note.");
    } finally {
      setNoteLoading(false);
    }
  };

  if (loading) {
    return <div className="page-shell page-message">Loading lead details...</div>;
  }

  if (error) {
    return <div className="page-shell page-message">{error}</div>;
  }

  if (!lead) {
    return <div className="page-shell page-message">Lead not found.</div>;
  }

  return (
    <div className="page-shell lead-details-page">
      <header className="details-header">
        <div>
          <button className="back-button" onClick={() => navigate("/admin")}>← Back to dashboard</button>
          <p className="details-label">Tracking ID</p>
          <h1>{lead.trackingId}</h1>
        </div>
        <div className="details-status-area">
          <span className={`priority ${lead.priority?.toLowerCase()}`}>{lead.priority}</span>
          <select value={lead.status} onChange={(e) => updateStatus(e.target.value)}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </header>

      <main className="details-content">
        <section className="details-grid">
          <div className="details-card">
            <h2>Client information</h2>
            <p>
              <strong>Name</strong>
              <span>{lead.name}</span>
            </p>
            <p>
              <strong>Email</strong>
              <span>{lead.email}</span>
            </p>
          </div>

          <div className="details-card">
            <h2>Project information</h2>
            <p>
              <strong>Project type</strong>
              <span>{lead.projectType}</span>
            </p>
            <p>
              <strong>Budget</strong>
              <span>{lead.budgetRange}</span>
            </p>
            <p>
              <strong>Timeline</strong>
              <span>{lead.timeline}</span>
            </p>
          </div>

          <div className="details-card">
            <h2>Lead intelligence</h2>
            <p>
              <strong>Lead score</strong>
              <span>{lead.leadScore}/100</span>
            </p>
            <p>
              <strong>Priority</strong>
              <span>{lead.priority}</span>
            </p>
            <p>
              <strong>Status</strong>
              <span>{lead.status}</span>
            </p>
          </div>
        </section>

        <section className="details-card">
          <h2>Client message</h2>
          <p className="large-text">{lead.message}</p>
        </section>

        {lead.projectBrief && (
          <section className="details-card project-brief">
            <h2>Project brief</h2>
            <p>{lead.projectBrief.summary}</p>
            <h3>Recommended services</h3>
            <ul>
              {lead.projectBrief.recommendedServices?.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
            <p>
              <strong>Estimated complexity:</strong> {lead.projectBrief.estimatedComplexity}
            </p>
          </section>
        )}

        <section className="details-card">
          <h2>Internal admin notes</h2>
          <form onSubmit={addNote}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an internal note..."
              maxLength={1000}
              rows={4}
            />
            <button type="submit" disabled={noteLoading}>
              {noteLoading ? "Saving note..." : "Add note"}
            </button>
          </form>

          <div className="notes-list">
            {lead.adminNotes?.length === 0 ? (
              <p>No internal notes yet.</p>
            ) : (
              lead.adminNotes
                .slice()
                .reverse()
                .map((adminNote, index) => (
                  <div className="note-item" key={`${adminNote.createdAt}-${index}`}>
                    <p>{adminNote.text}</p>
                    <small>{new Date(adminNote.createdAt).toLocaleString("en-IN")}</small>
                  </div>
                ))
            )}
          </div>
        </section>

        <section className="details-card">
          <h2>Activity timeline</h2>
          <div className="activity-timeline">
            {activities.length === 0 ? (
              <p>No activity recorded.</p>
            ) : (
              activities.map((activity) => (
                <div className="activity-item" key={activity._id}>
                  <div>
                    <strong>{activity.type}</strong>
                    <p>{activity.description}</p>
                  </div>
                  <small>{new Date(activity.createdAt).toLocaleString("en-IN")}</small>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LeadDetails;
