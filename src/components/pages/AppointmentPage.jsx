import React, { useState, useEffect } from "react";
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp, resendSignUpCode, fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import "./AppointmentPage.css";

const getInitialForm = (email = "") => ({
  firstName: "",
  lastName: "",
  email: email,
  makeModel: "",
  comments: "",
  appointmentDate: "",
  appointmentTime: "",
  services: {
    oilChange: false,
    dentRepair: false,
    tireRotation: false,
    tireChange: false,
    repaint: false,
  },
});

const initialAuthForm = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AppointmentPage() {
  const [form, setForm] = useState(getInitialForm());
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Check if email is verified by fetching user attributes
      try {
        const attributes = await fetchUserAttributes();
        const emailVerified = attributes.email_verified === 'true';
        setIsEmailVerified(emailVerified);
        
        // Store user's email
        if (attributes.email) {
          setUserEmail(attributes.email);
          // Auto-populate email in form
          setForm(prev => ({ ...prev, email: attributes.email }));
        }
        
        // If user exists but email is not verified, show verification form
        if (currentUser && !emailVerified) {
          setShowVerification(true);
        }
      } catch (attrErr) {
        // If we can't fetch attributes, assume not verified
        setIsEmailVerified(false);
        if (currentUser) {
          setShowVerification(true);
        }
      }
    } catch (err) {
      // User is not authenticated
      setUser(null);
      setIsEmailVerified(false);
      setShowLogin(true);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authForm.password !== authForm.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (authForm.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const { userId } = await signUp({
        username: authForm.email,
        password: authForm.password,
        options: {
          userAttributes: {
            email: authForm.email,
          },
        },
      });
      
      setSuccess("Account created! Please check your email for verification code.");
      setShowSignUp(false);
      setShowVerification(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to create account");
      setLoading(false);
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn({
        username: authForm.email,
        password: authForm.password,
      });
      
      setSuccess("Signed in successfully!");
      setShowLogin(false);
      setLoading(false);
      await checkAuthStatus();
      // Email will be auto-populated in checkAuthStatus
    } catch (err) {
      setError(err.message || "Failed to sign in");
      setLoading(false);
    }
  }

  async function handleVerifyEmail(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmSignUp({
        username: authForm.email || user?.username,
        confirmationCode: verificationCode,
      });
      
      setSuccess("Email verified! Please sign in to book an appointment.");
      setShowVerification(false);
      setLoading(false);
      // Clear verification code and show login
      setVerificationCode("");
      setShowLogin(true);
      // Clear password from auth form for security
      setAuthForm({ ...authForm, password: "" });
    } catch (err) {
      setError(err.message || "Failed to verify email");
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setError("");
    try {
      await resendSignUpCode({
        username: authForm.email || user?.username,
      });
      setSuccess("Verification code resent to your email!");
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
      setIsEmailVerified(false);
      setShowLogin(true);
      setUserEmail("");
      setForm(getInitialForm());
      setAppointments([]);
    } catch (err) {
      setError(err.message || "Failed to sign out");
    }
  }

  async function fetchAppointments() {
    if (!user || !userEmail) {
      console.log("Cannot fetch appointments: user or email missing", { user: !!user, userEmail });
      return;
    }
    
    setLoadingAppointments(true);
    setError(""); // Clear previous errors
    try {
      const client = generateClient();
      console.log("Fetching appointments for email:", userEmail);
      
      // Get all appointments and filter by email client-side
      const { data: appointmentsData, errors } = await client.models.Appointment.list();
      
      console.log("Raw response:", { appointmentsData, errors, count: appointmentsData?.length });
      console.log("All appointments in database:", appointmentsData);
      
      if (errors && errors.length > 0) {
        console.error("GraphQL errors:", errors);
        setError(`Failed to load appointments: ${errors.map(e => e.message).join(', ')}`);
        setAppointments([]);
      } else {
        // Filter appointments by user's email
        const filtered = (appointmentsData || []).filter(apt => apt.email === userEmail);
        setAppointments(filtered);
        console.log(`Successfully fetched ${filtered.length} appointment(s) for ${userEmail}:`, filtered);
        
        if (filtered.length === 0) {
          if (appointmentsData && appointmentsData.length > 0) {
            console.warn(`Found ${appointmentsData.length} total appointments, but none match email ${userEmail}`);
            console.log("All appointments with emails:", appointmentsData.map(apt => ({ 
              id: apt.id, 
              email: apt.email,
              firstName: apt.firstName,
              date: apt.appointmentDate 
            })));
            setError(`Found ${appointmentsData.length} appointment(s) in database, but none match your email. Your email: ${userEmail}`);
          } else {
            console.log("No appointments found in database at all.");
          }
        }
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments. Check console for details.");
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }

  // Generate available time slots (9 AM to 5 PM, every 30 minutes)
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

  // Generate available dates (next 30 days, excluding Sundays)
  function generateAvailableDates() {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  }

  // Get available time slots for a selected date (exclude already booked times)
  function getAvailableTimeSlots(selectedDate) {
    if (!selectedDate) return generateTimeSlots();
    
    const allSlots = generateTimeSlots();
    const bookedSlots = appointments
      .filter(apt => apt.appointmentDate === selectedDate)
      .map(apt => apt.appointmentTime);
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  }

  useEffect(() => {
    console.log("useEffect triggered:", { user: !!user, isEmailVerified, userEmail });
    if (user && isEmailVerified && userEmail) {
      console.log("Fetching appointments...");
      fetchAppointments();
    } else {
      console.log("Not fetching appointments - missing requirements");
    }
  }, [user, isEmailVerified, userEmail]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleAuthChange(e) {
    const { name, value } = e.target;
    setAuthForm((s) => ({ ...s, [name]: value }));
  }

  function toggleService(name) {
    setForm((s) => ({
      ...s,
      services: { ...s.services, [name]: !s.services[name] },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("=== FORM SUBMITTED ===");
    console.log("Form data:", form);
    console.log("User email:", userEmail);
    setError("");
    setLoading(true);

    if (!form.firstName.trim() || !userEmail || !form.appointmentDate || !form.appointmentTime) {
      setError("Please fill in all required fields (First Name, Date, and Time).");
      setLoading(false);
      return;
    }

    try {
      const client = generateClient();
      const appointmentData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: userEmail, // Use authenticated user's email
        makeModel: form.makeModel,
        comments: form.comments,
        services: JSON.stringify(form.services), // Convert to JSON string
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        status: "confirmed",
      };
      
      console.log("Creating appointment with data:", appointmentData);
      
      const result = await client.models.Appointment.create(appointmentData);
      
      console.log("Appointment creation result:", result);
      console.log("Created appointment ID:", result.data?.id);
      console.log("Created appointment email:", result.data?.email);
      
      if (result.errors && result.errors.length > 0) {
        console.error("Errors creating appointment:", result.errors);
        const errorMessages = result.errors.map(e => {
          console.error("Error details:", e);
          return e.message || JSON.stringify(e);
        });
        setError(`Failed to create appointment: ${errorMessages.join(', ')}`);
        setLoading(false);
        return;
      }
      
      if (!result.data) {
        console.error("No data returned from create operation");
        setError("Failed to create appointment: No data returned");
        setLoading(false);
        return;
      }

      setSuccess("Appointment booked successfully!");
      setSubmitted(true);
      setForm(getInitialForm(userEmail));
      setLoading(false);
      
      // Wait a moment for the database to update, then refresh appointments list
      setTimeout(async () => {
        await fetchAppointments();
      }, 500);
      
      setTimeout(() => {
        setSubmitted(false);
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(err.message || "Failed to book appointment");
      setLoading(false);
    }
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <section className="appointment-wrapper">
        <div className="appointment-card">
          <h1 className="card-title">Book an Appointment</h1>
          <p className="auth-message">Please sign in or create an account to book an appointment.</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {showSignUp ? (
            <form onSubmit={handleSignUp} className="appointment-form">
              <h2>Create Account</h2>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  className="text-input"
                  placeholder="Email"
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  className="text-input"
                  placeholder="Password (min 8 characters)"
                  required
                />
              </label>
              <label>
                Confirm Password
                <input
                  name="confirmPassword"
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={handleAuthChange}
                  className="text-input"
                  placeholder="Confirm Password"
                  required
                />
              </label>
              <div className="submit-row">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating..." : "Sign Up"}
                </button>
              </div>
              <p className="auth-switch">
                Already have an account?{" "}
                <button type="button" onClick={() => { setShowSignUp(false); setShowLogin(true); setError(""); }} className="link-btn">
                  Sign In
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="appointment-form">
              <h2>Sign In</h2>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  className="text-input"
                  placeholder="Email"
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  className="text-input"
                  placeholder="Password"
                  required
                />
              </label>
              <div className="submit-row">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
              <p className="auth-switch">
                Don't have an account?{" "}
                <button type="button" onClick={() => { setShowLogin(false); setShowSignUp(true); setError(""); }} className="link-btn">
                  Sign Up
                </button>
              </p>
            </form>
          )}
        </div>
      </section>
    );
  }

  // Show verification form if email not verified
  if (user && showVerification && !isEmailVerified) {
    return (
      <section className="appointment-wrapper">
        <div className="appointment-card">
          <h1 className="card-title">Verify Your Email</h1>
          <p className="auth-message">Please verify your email address to book an appointment. Check your inbox for the verification code.</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleVerifyEmail} className="appointment-form">
            <label>
              Verification Code
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-input"
                placeholder="Enter verification code"
                required
              />
            </label>
            <div className="submit-row">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
            <p className="auth-switch">
              Didn't receive a code?{" "}
              <button type="button" onClick={handleResendCode} className="link-btn">
                Resend Code
              </button>
            </p>
          </form>
        </div>
      </section>
    );
  }

  // Show appointment form if authenticated and verified
  return (
    <section className="appointment-wrapper">
      <div className="appointment-card">
        <div className="appointment-header">
          <h1 className="card-title">Book an Appointment</h1>
          <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Show appointments at the top if any exist */}
        {appointments.length > 0 && (
          <div className="appointments-section">
            <div className="appointments-header">
              <h2>My Appointments</h2>
              <button 
                onClick={() => {
                  console.log("Manual refresh clicked", { user, userEmail, isEmailVerified });
                  fetchAppointments();
                }} 
                className="refresh-btn"
                disabled={loadingAppointments}
              >
                {loadingAppointments ? "Loading..." : "Refresh"}
              </button>
            </div>
            
            <div className="appointments-list">
              {appointments.map((apt) => {
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
          </div>
        )}

        <form onSubmit={handleSubmit} className="appointment-form">
          <label>
            First Name *
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="text-input"
              placeholder="First Name"
              autoComplete="given-name"
              required
            />
          </label>

          <label>
            Last Name
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="text-input"
              placeholder="Last Name"
              autoComplete="family-name"
            />
          </label>

          {userEmail && (
            <div className="user-email-display">
              <p><strong>Booking as:</strong> {userEmail}</p>
            </div>
          )}

          <label>
            Appointment Date *
            <select
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={(e) => {
                handleChange(e);
                // Reset time when date changes
                setForm(prev => ({ ...prev, appointmentTime: "" }));
              }}
              className="text-input"
              required
            >
              <option value="">Select a date</option>
              {generateAvailableDates().map(date => {
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
                return (
                  <option key={date} value={date}>
                    {formattedDate}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            Appointment Time *
            <select
              name="appointmentTime"
              value={form.appointmentTime}
              onChange={handleChange}
              className="text-input"
              required
              disabled={!form.appointmentDate}
            >
              <option value="">
                {!form.appointmentDate ? "Select a date first" : "Select a time"}
              </option>
              {form.appointmentDate && getAvailableTimeSlots(form.appointmentDate).map(time => {
                const [hours, minutes] = time.split(':');
                const hour12 = parseInt(hours) % 12 || 12;
                const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                const displayTime = `${hour12}:${minutes} ${ampm}`;
                return (
                  <option key={time} value={time}>
                    {displayTime}
                  </option>
                );
              })}
            </select>
            {form.appointmentDate && getAvailableTimeSlots(form.appointmentDate).length === 0 && (
              <p className="no-slots-message">No available time slots for this date. Please select another date.</p>
            )}
          </label>

          <div className="services-row">
            <div className="service-item">
              <input
                id="oilChange"
                type="checkbox"
                checked={form.services.oilChange}
                onChange={() => toggleService("oilChange")}
              />
              <label htmlFor="oilChange">Oil Change</label>
            </div>

            <div className="service-item">
              <input
                id="dentRepair"
                type="checkbox"
                checked={form.services.dentRepair}
                onChange={() => toggleService("dentRepair")}
              />
              <label htmlFor="dentRepair">Dent Repair</label>
            </div>

            <div className="service-item">
              <input
                id="tireRotation"
                type="checkbox"
                checked={form.services.tireRotation}
                onChange={() => toggleService("tireRotation")}
              />
              <label htmlFor="tireRotation">Tire Rotation</label>
            </div>

            <div className="service-item">
              <input
                id="tireChange"
                type="checkbox"
                checked={form.services.tireChange}
                onChange={() => toggleService("tireChange")}
              />
              <label htmlFor="tireChange">Tire Change</label>
            </div>

            <div className="service-item">
              <input
                id="repaint"
                type="checkbox"
                checked={form.services.repaint}
                onChange={() => toggleService("repaint")}
              />
              <label htmlFor="repaint">Repaint</label>
            </div>
          </div>

          <label>
            Car Make and Model
            <input
              name="makeModel"
              value={form.makeModel}
              onChange={handleChange}
              className="text-input"
              placeholder="Make and model"
            />
          </label>

          <label>
            Additional Comments
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              rows={6}
              className="comments"
              placeholder="Anything else we should know?"
            />
          </label>

          <div className="submit-row">
            <button type="submit" className="submit-btn" disabled={loading || submitted}>
              {loading ? "Booking..." : submitted ? "Booked!" : "Book Appointment"}
            </button>
          </div>
        </form>

        {/* Show appointments section at bottom if none exist (for loading/empty states) */}
        {appointments.length === 0 && (
          <div className="appointments-section">
            <div className="appointments-header">
              <h2>My Appointments</h2>
              <button 
                onClick={() => {
                  console.log("Manual refresh clicked", { user, userEmail, isEmailVerified });
                  fetchAppointments();
                }} 
                className="refresh-btn"
                disabled={loadingAppointments}
              >
                {loadingAppointments ? "Loading..." : "Refresh"}
              </button>
            </div>
            
            {loadingAppointments ? (
              <p className="loading-message">Loading appointments...</p>
            ) : (
              <p className="no-appointments">No appointments booked yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
