import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    closed: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/leads", {
        params: { search, status, page, limit: 6 },
      });
      setLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        setError("Failed to fetch enquiries. Please try again shortly.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/leads/stats");
      setStats(response.data.stats);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [search, status, page]);

  const updateStatus = async (leadId, newStatus) => {
    try {
      const response = await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead._id === leadId ? response.data.lead : lead))
      );
      await fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const { total, new: newLeads, contacted, closed, highPriority } = stats;

  return (
    <div className="page-shell admin-dashboard">
      <header className="dashboard-header">
        <div>
          <p>LeadDesk Pro Admin</p>
          <h1>Enquiry dashboard</h1>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-controls">
          <div>
            <h2>Enquiry workspace</h2>
            <p>Search, filter, and manage inbound leads from a polished overview.</p>
          </div>
          <div className="filter-summary">
            <span>{total} enquiries</span>
            <span>{newLeads} new</span>
            <span>{contacted} contacted</span>
          </div>
        </section>

        <section className="filters">
          <input
            type="text"
            placeholder="Search by name, email or tracking ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </section>
        <section className="stats-grid">
          <article className="stat-card">
            <span>Total enquiries</span>
            <strong>{total}</strong>
          </article>
          <article className="stat-card">
            <span>New</span>
            <strong>{newLeads}</strong>
          </article>
          <article className="stat-card">
            <span>Contacted</span>
            <strong>{contacted}</strong>
          </article>
          <article className="stat-card">
            <span>Closed</span>
            <strong>{closed}</strong>
          </article>
          <article className="stat-card">
            <span>High priority</span>
            <strong>{highPriority}</strong>
          </article>
        </section>

        {loading && <p className="loading">Loading enquiries...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && leads.length === 0 && (
          <div className="empty-state-card">
            <h2>No enquiries found</h2>
            <p>New leads will appear here once they are submitted.</p>
          </div>
        )}

        <section className="leads-grid">
          {leads.map((lead) => (
            <article className="lead-card" key={lead._id}>
              <div className="lead-card-body">
                <div className="lead-meta">
                  <div className="avatar" aria-hidden>
                    {lead.name ? lead.name.charAt(0).toUpperCase() : "L"}
                  </div>
                  <div className="lead-title">
                    <h2>{lead.name}</h2>
                    <p className="muted">{lead.email}</p>
                    <div className={`priority-badge ${lead.priority?.toLowerCase()}`}>
                      {lead.priority || "Normal"}
                    </div>
                  </div>
                </div>

                <div className="lead-columns">
                  <div className="lead-column">
                    <p><strong>Tracking ID:</strong> {lead.trackingId}</p>
                    <p><strong>Project:</strong> {lead.projectType}</p>
                    <p><strong>Budget:</strong> {lead.budgetRange}</p>
                  </div>
                  <div className="lead-column">
                    <p><strong>Timeline:</strong> {lead.timeline}</p>
                    <p><strong>Lead score:</strong> {lead.leadScore}</p>
                    {lead.projectBrief && (
                      <p><strong>AI brief:</strong> {lead.projectBrief.estimatedComplexity}</p>
                    )}
                  </div>
                </div>

                <div className="lead-message">
                  <strong>Message</strong>
                  <p>{lead.message}</p>
                </div>
              </div>

              <aside className="lead-actions">
                <div className="status-control">
                  <label>
                    Status
                    <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </label>
                </div>
                <button className="view-details-button" onClick={() => navigate(`/admin/leads/${lead._id}`)}>
                  View details
                </button>
                <div className={`status-badge ${lead.status?.toLowerCase()}`}>{lead.status}</div>
              </aside>
            </article>
          ))}
        </section>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((page) => page - 1)}>
              ← Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage((page) => page + 1)}>
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
