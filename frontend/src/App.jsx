import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TrackLead from "./pages/TrackLead";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import LeadDetails from "./pages/LeadDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track" element={<TrackLead />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/leads/:id" element={<LeadDetails />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Built for Digital Heroes Training Task ·
          <a href="https://digitalheroesco.com" target="_blank" rel="noreferrer">
            digitalheroesco.com
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;