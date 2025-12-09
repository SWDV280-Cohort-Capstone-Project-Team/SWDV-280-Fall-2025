// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import AboutSection from "./components/AboutSection/AboutSection";
import Services from "./components/Services/Services";
import ContactUs from "./components/ContactUs/ContactUs";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import Testimonials from "./components/Testimonials/Testimonials";
import AppointmentSection from "./components/AppointmentSection/AppointmentSection";
import AppointmentPage from "./components/pages/AppointmentPage";
import AdminDashboard from "./components/pages/AdminDashboard";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

function Home() {
  return (
    <>
      <Landing />
      <main className="page-wrapper">
        <AboutSection />
        <Services />
        <ContactUs />
        <PhotoGallery />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/login" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
