import { Link } from "react-router-dom";
import LeadForm from "../components/LeadForm";

function Home() {
  return (
    <div className="page-shell home-page">
      <header className="topbar">
        <div className="brand">
          <span>LeadDesk Pro</span>
        </div>
        <nav className="topnav">
          <Link to="/track">Track Enquiry</Link>
          <Link to="/admin/login" className="primary">
            Admin Portal
          </Link>
        </nav>
      </header>

      <main className="hero-grid">
        <section className="hero-copy">
          <p className="eyebrow">TURN IDEAS INTO ACTION</p>
          <h1>
            Deliver your next project with
            <span> intelligent lead management.</span>
          </h1>
          <p>
            LeadDeskPro makes enquiry submission, tracking, and admin response
            simple with a polished, easy-to-navigate experience.
          </p>

          <div className="hero-actions">
            <Link to="/track" className="button">
              Track Existing Enquiry
            </Link>
            <Link to="/admin/login" className="secondary-button">
              Admin Login
            </Link>
          </div>
        </section>

        <aside className="hero-form">
          <h2>Start your project</h2>
          <p>Submit your details and get a tracking ID immediately.</p>
          <LeadForm />
        </aside>
      </main>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Fast submissions</h3>
          <p>
            Friction-free form entry with clear fields and responsive feedback.
          </p>
        </article>
        <article className="feature-card">
          <h3>Instant tracking</h3>
          <p>
            Visitors can check enquiry progress instantly with a secure tracking ID.
          </p>
        </article>
        <article className="feature-card">
          <h3>Admin-ready layout</h3>
          <p>
            Clean dashboards and simplified controls make lead management easy.
          </p>
        </article>
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <p>How the desk works</p>
          <h2>One simple workflow for every enquiry</h2>
        </div>

        <div className="workflow-grid">
          <article className="workflow-card">
            <span className="step-number">1</span>
            <h3>File</h3>
            <p>
              A client submits name, email, project details and budget so every
              enquiry is captured with context.
            </p>
          </article>
          <article className="workflow-card">
            <span className="step-number">2</span>
            <h3>Review</h3>
            <p>
              The admin reviews incoming enquiries, searches by name or tracking
              ID, and updates the lead status clearly.
            </p>
          </article>
          <article className="workflow-card">
            <span className="step-number">3</span>
            <h3>Close</h3>
            <p>
              Leads move from New to Contacted to Closed with one click so no
              enquiry is lost.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
