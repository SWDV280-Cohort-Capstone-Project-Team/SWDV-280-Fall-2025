import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import "./AppointmentPage.css";

export default function AdminDashboard() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loadingAllAppointments, setLoadingAllAppointments] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  async function fetchAllAppointments() {
    setLoadingAllAppointments(true);
    setError("");
    try {
      const client = generateClient();
      const { data: appointmentsData, errors } = await client.models.Appointment.list();
      
      if (errors && errors.length > 0) {
        console.error("GraphQL errors fetching all appointments:", errors);
        setError(`Failed to load appointments: ${errors.map(e => e.message).join(', ')}`);
        setAllAppointments([]);
      } else {
        setAllAppointments(appointmentsData || []);
      }
    } catch (err) {
      console.error("Error fetching all appointments:", err);
      setError(err.message || "Failed to load appointments. Check console for details.");
      setAllAppointments([]);
    } finally {
      setLoadingAllAppointments(false);
    }
  }

  return (
    <section className="appointment-wrapper">
      <div className="appointment-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">All Appointments Dashboard</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-content">
          {/* All Appointments Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>All Appointments</h2>
              <button 
                onClick={fetchAllAppointments} 
                className="refresh-btn"
                disabled={loadingAllAppointments}
              >
                {loadingAllAppointments ? "Loading..." : "Refresh"}
              </button>
            </div>
            
            {loadingAllAppointments && allAppointments.length === 0 ? (
              <p className="loading-message">Loading all appointments...</p>
            ) : allAppointments.length === 0 ? (
              <p className="no-appointments">No appointments booked yet.</p>
            ) : (
              <div className="appointments-list">
                {allAppointments.map((apt) => {
                  const dateObj = new Date(apt.appointmentDate);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                  const [hours, minutes] = apt.appointmentTime.split(':');
                  const hour12 = parseInt(hours) % 12 || 12;
                  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                  const displayTime = `${hour12}:${minutes} ${ampm}`;
                  
                  return (
                    <div key={apt.id} className="appointment-item">
                      <div className="appointment-details">
                        <h3>{apt.firstName} {apt.lastName}</h3>
                        <p><strong>Email:</strong> {apt.email}</p>
                        <p><strong>Date:</strong> {formattedDate}</p>
                        <p><strong>Time:</strong> {displayTime}</p>
                        {apt.makeModel && <p><strong>Vehicle:</strong> {apt.makeModel}</p>}
                        {(() => {
                          // Parse services if it's a JSON string, otherwise use as-is
                          let services = apt.services;
                          if (typeof services === 'string') {
                            try {
                              services = JSON.parse(services);
                            } catch (e) {
                              console.error("Error parsing services JSON:", e);
                              services = null;
                            }
                          }
                          return services && Object.keys(services).some(key => services[key]) && (
                            <p><strong>Services:</strong> {
                              Object.entries(services)
                                .filter(([_, value]) => value)
                                .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim())
                                .join(', ')
                            }</p>
                          );
                        })()}
                        {apt.comments && <p><strong>Comments:</strong> {apt.comments}</p>}
                        <p><strong>Status:</strong> <span className={`status-${apt.status}`}>{apt.status}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
