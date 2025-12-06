import React, { useState } from "react";
import "../pages/AppointmentPage.css";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  makeModel: "",
  comments: "",
  services: {
    oilChange: false,
    dentRepair: false,
    tireRotation: false,
    tireChange: false,
    repaint: false,
  },
};

export default function AppointmentSection() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function toggleService(name) {
    setForm((s) => ({
      ...s,
      services: { ...s.services, [name]: !s.services[name] },
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) {
      alert("Please enter at least your first name and email.");
      return;
    }
    console.log("Appointment submitted:", form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(initialForm);
    }, 1600);
  }

  return (
    <section className="appointment-wrapper" id="Appointment">
      <h2 className="section-title">Book an Appointment</h2>
      <div className="appointment-card">

        <form onSubmit={handleSubmit} className="appointment-form">
          <label>
            First Name
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="text-input"
              placeholder="First Name"
              autoComplete="given-name"
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

          <label>
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="text-input"
              placeholder="Email"
              autoComplete="email"
            />
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
            <button type="submit" className="submit-btn">
              {submitted ? "Submitted" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

