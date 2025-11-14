// src/App.jsx

import React from 'react';

// ⬅️ Change this import path and name
import AboutSection from './components/AboutSection/AboutSection'; 
import Services from './components/Services/Services'; 
import Landing from './components/Landing/Landing'; 
import ContactUs from './components/ContactUs/ContactUs';
import PhotoGallery from './components/PhotoGallery/PhotoGallery';
import Footer from './components/Footer/Footer'
import Testimonials from './components/Testimonials/Testimonials'
import './App.css'; 

function App() {
  return (
    <>
      <Landing />
      <main className="page-wrapper">
        {/* nav and hero section*/}
        {/*<Landing />*/}
        <AboutSection /> 
        <Services /> 
        <ContactUs />
        <PhotoGallery/>
        <Testimonials />
      </main>
      <Footer/>
    </>  
  );
}

export default App;