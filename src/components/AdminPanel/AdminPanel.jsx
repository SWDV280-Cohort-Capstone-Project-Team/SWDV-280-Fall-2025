import React from "react";
import "./AdminPanel.css";

function AdminPanel({ user, signOut }) {
  return (
    <div className="admin-panel">
      <header>
        <div>
          <p className="admin-panel__eyebrow">Admin Dashboard</p>
          <h1>Welcome back, {user?.username}</h1>
          <p className="admin-panel__subtext">
            Use the tools below to manage site content and data.
          </p>
        </div>
        <button className="admin-panel__signout" onClick={signOut}>
          Sign out
        </button>
      </header>

      <section className="admin-panel__grid">
        <div className="admin-panel__card">
          <h2>Users</h2>
          <p>Review pending registrations and manage access.</p>
        </div>
        <div className="admin-panel__card">
          <h2>Appointments</h2>
          <p>Track upcoming bookings and recent activity.</p>
        </div>
        <div className="admin-panel__card">
          <h2>Content</h2>
          <p>Publish updates to services, gallery, and announcements.</p>
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;

