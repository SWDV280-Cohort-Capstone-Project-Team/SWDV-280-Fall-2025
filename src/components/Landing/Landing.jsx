import React, { useState } from 'react';
import './Landing.css';
import MainPic from '../../assets/images/MainPic.jpg';
import Logo from '../../assets/Icons/logo.png';

import { HashLink as Link } from 'react-router-hash-link'; // Use Link alias for simplicity
// REMEMBER: You must remove 'import { Link } from "react-router-dom";' if you used it before


export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="lr-root" id='Home'>
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
            {/*
            <a href="#Home" onClick={closeMenu}>Home</a>
            <a href="#Appointment" onClick={closeMenu}>Appointment</a>
            <a href="#Services" onClick={closeMenu}>Services</a>
            <a href="#About" onClick={closeMenu}>About</a>
            <a href="#login" onClick={closeMenu}>Log In</a>
            */}

            {/* Home Link: Navigates to the root and scrolls to the top of the hero */}
    <Link to="/#Home" onClick={closeMenu}>Home</Link> 
    
    {/* Appointment Link: Navigates to the separate page route */}
    <Link to="/appointment" onClick={closeMenu}>Appointment</Link> 
    
    {/* Services Link: Navigates to root path and scrolls to #services */}
    <Link to="/#Services" onClick={closeMenu}>Services</Link> 
    
    {/* About Link: Navigates to root path and scrolls to #about */}
    <Link to="/#About" onClick={closeMenu}>About</Link>
    
    {/* Log In Link: Navigates to the separate page route */}
    <Link to="/login" onClick={closeMenu}>Log In</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="lr-hero-wrap" id="home">
          <img src={MainPic} alt="Mechanic at work" className="lr-hero-img" />
          <div className="lr-hero-overlay">
            <div className="lr-hero-buttons">

              <a
                className="lr-btn"
                href="/#/appointment"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Appointment
              </a>

              {/*Contact us btn using the hash rout*/}
              <Link to="/#ContactUS"  className="lr-btn lr-secondary"  onClick={closeMenu}>Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
