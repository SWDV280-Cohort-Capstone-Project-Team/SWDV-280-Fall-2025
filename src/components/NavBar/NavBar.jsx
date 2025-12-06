import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Landing/Landing.css';
import Logo from '../../assets/Icons/logo.png';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const scrollToSection = (sectionId) => {
    closeMenu();
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

  const handleHomeClick = (e) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAppointmentClick = (e) => {
    e.preventDefault();
    closeMenu();
    navigate('/appointment');
  };

  return (
    <header className="lr-topbar">
      <div className="lr-container">
        <div className="lr-brand">
          <div className="lr-logo-wrap">
            <img src={Logo} alt="Otterly Reliable logo" className="lr-logo" />
          </div>
          <div className="lr-title">Otterly Reliable</div>
        </div>

        <button
          className={`lr-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`lr-nav ${menuOpen ? 'open' : ''}`}>
          <a href="/" onClick={handleHomeClick}>Home</a>
          <a href="#About" onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About</a>
          <a href="#Services" onClick={(e) => { e.preventDefault(); scrollToSection('Services'); }}>Services</a>
          <a href="#ContactUS" onClick={(e) => { e.preventDefault(); scrollToSection('ContactUS'); }}>Contact</a>
          <Link to="/appointment" onClick={closeMenu}>Appointment</Link>
          <Link to="/login" onClick={closeMenu}>Login</Link>
        </nav>
      </div>
    </header>
  );
}

