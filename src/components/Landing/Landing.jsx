import React, { useState } from 'react';
import './Landing.css';
import MainPic from '../../assets/images/MainPic.jpg';
import Logo from '../../assets/Icons/logo.png';

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
            <a href="#Home" onClick={closeMenu}>Home</a>
            <a href="#appointment" onClick={closeMenu}>Appointment</a>
            <a href="#Services" onClick={closeMenu}>Services</a>
            <a href="#About" onClick={closeMenu}>About</a>
            <a href="#login" onClick={closeMenu}>Log In</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="lr-hero-wrap" id="home">
          <img src={MainPic} alt="Mechanic at work" className="lr-hero-img" />
          <div className="lr-hero-overlay">
            <div className="lr-hero-buttons">
              <a className="lr-btn" href="#appointment">Book Appointment</a>
              <a className="lr-btn lr-secondary" href="#about">About Us</a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
