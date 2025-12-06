import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Landing.css';
import MainPic from '../../assets/images/MainPic.jpg';

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="lr-root" id='Home'>
      <main>
        <section className="lr-hero-wrap" id="home">
          <img src={MainPic} alt="Mechanic at work" className="lr-hero-img" />
          <div className="lr-hero-overlay">
            <div className="lr-hero-buttons">

              <Link
                className="lr-btn"
                to="/appointment"
              >
                Book Appointment
              </Link>

              <a 
                className="lr-btn lr-secondary" 
                href="#ContactUS"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('ContactUS');
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
