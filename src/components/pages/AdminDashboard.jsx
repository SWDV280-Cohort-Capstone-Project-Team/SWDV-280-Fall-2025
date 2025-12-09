import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { signIn, signOut, getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import Calendar from "../Calendar/Calendar";
import "./AppointmentPage.css";

// Admin credentials - in production, this should be stored securely
const ADMIN_EMAIL = "admin@otterlyreliable.com";
const ADMIN_PASSWORD = "Admin123!";

export default function AdminDashboard() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loadingAllAppointments, setLoadingAllAppointments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  useEffect(() => {
    // For development: bypass authentication check and load appointments directly
    // In production, uncomment checkAdminAuth() and remove the direct fetch
    setIsCheckingAuth(false);
    setIsAuthenticated(true); // Bypass auth for development
    fetchAllAppointments();
    
    // Uncomment below for production authentication:
    // checkAdminAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAppointments();
    }
  }, [isAuthenticated]);

  async function checkAdminAuth() {
    setIsCheckingAuth(true);
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      // Check if user is admin
      if (attributes.email && attributes.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        await signOut();
      }
    } catch (err) {
      // User not authenticated
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check credentials
    if (authForm.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || authForm.password !== ADMIN_PASSWORD) {
      setError("Invalid admin credentials");
      setLoading(false);
      return;
    }

    try {
      // Try to sign in with admin credentials
      await signIn({
        username: authForm.email,
        password: authForm.password,
      });
      
      setSuccess("Admin login successful!");
      setIsAuthenticated(true);
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      // If user doesn't exist, show message to create account first
      if (err.message?.includes("User does not exist")) {
        setError(`Admin account not found. Please create an account with email: ${ADMIN_EMAIL} first, then use this panel to login.`);
      } else {
        setError(err.message || "Failed to login");
      }
      setLoading(false);
    }
  }

  async function handleAdminLogout() {
    try {
      await signOut();
      setIsAuthenticated(false);
      setAuthForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Failed to logout");
    }
  }

  async function fetchAllAppointments() {
    setLoadingAllAppointments(true);
    setError("");
    try {
      // Use API key authorization for public access (development)
      const client = generateClient({
        authMode: 'apiKey'
      });
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

  // Get appointments for selected date
  function getAppointmentsForDate(dateString) {
    if (!dateString) return [];
    return allAppointments.filter(apt => apt.appointmentDate === dateString);
  }

  function handleDateSelect(dateString) {
    setSelectedDate(dateString);
  }

  async function handleCancelAppointment(appointmentId) {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setError("");
    try {
      const client = generateClient({ authMode: 'apiKey' });
      const result = await client.models.Appointment.update({
        id: appointmentId,
        status: "cancelled",
      });

      if (result.errors && result.errors.length > 0) {
        setError(`Failed to cancel appointment: ${result.errors.map(e => e.message).join(', ')}`);
        return;
      }

      setSuccess("Appointment cancelled successfully!");
      await fetchAllAppointments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError(err.message || "Failed to cancel appointment");
    }
  }

  async function handleApproveAppointment(appointmentId) {
    setError("");
    try {
      const client = generateClient({ authMode: 'apiKey' });
      const result = await client.models.Appointment.update({
        id: appointmentId,
        status: "confirmed",
      });

      if (result.errors && result.errors.length > 0) {
        setError(`Failed to approve appointment: ${result.errors.map(e => e.message).join(', ')}`);
        return;
      }

      setSuccess("Appointment approved successfully!");
      await fetchAllAppointments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error approving appointment:", err);
      setError(err.message || "Failed to approve appointment");
    }
  }

  function handleEditAppointment(appointment) {
    // Parse services if it's a JSON string
    let services = appointment.services;
    if (typeof services === 'string') {
      try {
        services = JSON.parse(services);
      } catch (e) {
        services = {
          oilChange: false,
          dentRepair: false,
          tireRotation: false,
          tireChange: false,
          repaint: false,
        };
      }
    }

    setEditForm({
      id: appointment.id,
      firstName: appointment.firstName,
      lastName: appointment.lastName || "",
      makeModel: appointment.makeModel || "",
      comments: appointment.comments || "",
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      services: services || {
        oilChange: false,
        dentRepair: false,
        tireRotation: false,
        tireChange: false,
        repaint: false,
      },
    });
    setEditingAppointment(appointment.id);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  function handleEditServiceToggle(name) {
    setEditForm(prev => ({
      ...prev,
      services: { ...prev.services, [name]: !prev.services[name] },
    }));
  }

  async function handleUpdateAppointment(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!editForm.firstName.trim() || !editForm.appointmentDate || !editForm.appointmentTime) {
      setError("Please fill in all required fields (First Name, Date, and Time).");
      setLoading(false);
      return;
    }

    try {
      const client = generateClient({ authMode: 'apiKey' });
      const result = await client.models.Appointment.update({
        id: editForm.id,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        makeModel: editForm.makeModel,
        comments: editForm.comments,
        services: JSON.stringify(editForm.services),
        appointmentDate: editForm.appointmentDate,
        appointmentTime: editForm.appointmentTime,
      });

      if (result.errors && result.errors.length > 0) {
        setError(`Failed to update appointment: ${result.errors.map(e => e.message).join(', ')}`);
        setLoading(false);
        return;
      }

      setSuccess("Appointment updated successfully!");
      setEditingAppointment(null);
      setEditForm(null);
      setLoading(false);
      await fetchAllAppointments();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(err.message || "Failed to update appointment");
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setEditingAppointment(null);
    setEditForm(null);
  }

  // Calculate min and max dates for edit form
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  // Generate time slots
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <section className="appointment-wrapper">
        <div className="appointment-card">
          <p className="loading-message">Checking authentication...</p>
        </div>
      </section>
    );
  }

  // Show login form if not authenticated (commented out for development)
  // Uncomment this block to enable authentication in production
  /*
  if (!isAuthenticated) {
    return (
      <section className="appointment-wrapper">
        <div className="appointment-card">
          <h1 className="card-title">Admin Login</h1>
          <p className="auth-message">Please enter admin credentials to access the admin panel.</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleAdminLogin} className="appointment-form">
            <label>
              Admin Email
              <input
                name="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="text-input"
                placeholder="admin@otterlyreliable.com"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="text-input"
                placeholder="Password"
                required
              />
            </label>
            <div className="submit-row">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <p className="auth-message" style={{ fontSize: '0.9em', marginTop: '20px', color: '#666' }}>
              Default credentials: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
            </p>
          </form>
        </div>
      </section>
    );
  }
  */

  // Show admin panel (authentication bypassed for development)
  const appointmentsForSelectedDate = selectedDate ? getAppointmentsForDate(selectedDate) : [];
  const minDate = today.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <section className="appointment-wrapper">
      <div className="appointment-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Panel</h1>
          {/* Logout button disabled for development - uncomment when auth is enabled */}
          {/* <button onClick={handleAdminLogout} className="sign-out-btn">Logout</button> */}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="dashboard-content">
          {/* Calendar Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Calendar View</h2>
            </div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              minDate={minDate}
              maxDate={maxDateStr}
            />
            {selectedDate && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#234e4d', marginBottom: '10px' }}>
                  Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {appointmentsForSelectedDate.length === 0 ? (
                  <p className="no-appointments">No appointments scheduled for this date.</p>
                ) : (
                  <div className="appointments-list">
                    {appointmentsForSelectedDate.map((apt) => {
                      const [hours, minutes] = apt.appointmentTime.split(':');
                      const hour12 = parseInt(hours) % 12 || 12;
                      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                      const displayTime = `${hour12}:${minutes} ${ampm}`;
                      
                      return (
                        <div key={apt.id} className="appointment-item">
                          <div className="appointment-details">
                            <h3>{apt.firstName} {apt.lastName}</h3>
                            <p><strong>Time:</strong> {displayTime}</p>
                            <p><strong>Email:</strong> {apt.email}</p>
                            {apt.makeModel && <p><strong>Vehicle:</strong> {apt.makeModel}</p>}
                            <p><strong>Status:</strong> <span className={`status-${apt.status}`}>{apt.status}</span></p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

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
                  
                  const isEditing = editingAppointment === apt.id;
                  
                  return (
                    <div key={apt.id} className="appointment-item">
                      {isEditing ? (
                        <form onSubmit={handleUpdateAppointment} className="appointment-form">
                          <h3>Edit Appointment</h3>
                          <label>
                            First Name *
                            <input
                              name="firstName"
                              value={editForm.firstName}
                              onChange={handleEditChange}
                              className="text-input"
                              required
                            />
                          </label>
                          <label>
                            Last Name
                            <input
                              name="lastName"
                              value={editForm.lastName}
                              onChange={handleEditChange}
                              className="text-input"
                            />
                          </label>
                          <label>
                            Vehicle Make/Model
                            <input
                              name="makeModel"
                              value={editForm.makeModel}
                              onChange={handleEditChange}
                              className="text-input"
                            />
                          </label>
                          <label>
                            Appointment Date *
                            <input
                              name="appointmentDate"
                              type="date"
                              value={editForm.appointmentDate}
                              onChange={handleEditChange}
                              className="text-input"
                              min={minDate}
                              max={maxDateStr}
                              required
                            />
                          </label>
                          <label>
                            Appointment Time *
                            <select
                              name="appointmentTime"
                              value={editForm.appointmentTime}
                              onChange={handleEditChange}
                              className="text-input"
                              required
                            >
                              <option value="">Select Time</option>
                              {generateTimeSlots().map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </label>
                          <div className="services-row">
                            {Object.entries(editForm.services).map(([key, value]) => (
                              <div key={key} className="service-item">
                                <input
                                  id={`edit-${key}-${apt.id}`}
                                  type="checkbox"
                                  checked={value}
                                  onChange={() => handleEditServiceToggle(key)}
                                />
                                <label htmlFor={`edit-${key}-${apt.id}`}>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                              </div>
                            ))}
                          </div>
                          <label>
                            Comments
                            <textarea
                              name="comments"
                              value={editForm.comments}
                              onChange={handleEditChange}
                              rows={4}
                              className="comments"
                            />
                          </label>
                          <div className="submit-row">
                            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                              Cancel
                            </button>
                            <button type="submit" className="submit-btn" disabled={loading}>
                              {loading ? "Updating..." : "Update Appointment"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
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
                          <div className="appointment-actions">
                            <button
                              onClick={() => handleEditAppointment(apt)}
                              className="action-btn edit-btn"
                            >
                              Edit
                            </button>
                            {apt.status !== 'confirmed' && (
                              <button
                                onClick={() => handleApproveAppointment(apt.id)}
                                className="action-btn approve-btn"
                              >
                                Approve
                              </button>
                            )}
                            {apt.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="action-btn cancel-btn"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </>
                      )}
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
