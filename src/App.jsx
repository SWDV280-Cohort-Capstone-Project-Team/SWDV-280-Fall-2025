// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing/Landing";
import AboutSection from "./components/AboutSection/AboutSection";
import Services from "./components/Services/Services";
import ContactUs from "./components/ContactUs/ContactUs";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";

// correct import path based on your tree
import AppointmentPage from "./components/pages/AppointmentPage";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<AppointmentPage />} />
      </Routes>
    </Router>
  );
}
