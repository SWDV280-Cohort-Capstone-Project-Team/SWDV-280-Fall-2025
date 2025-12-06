import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

const SocialIcon = ({ imgPath, faClass, alt }) => {
  // If an image exists in public/social, browser will load it; otherwise Font Awesome renders.
  return (
    <span className="social-item">
      <img
        src={imgPath}
        alt={alt}
        className="social-img"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
      <i className={faClass + " social-fa"} aria-hidden="true"></i>
      <span className="social-text">{alt}</span>
    </span>
  );
};

export default function Footer() {
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

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-inner">
        <div className="col contact">
          <div className="logo-wrap">
            <div className="logo-circle">
              {/* public/logo.png — MUST be in public folder */}
              <img src="./assets/Icons/footer-logo.png" alt="footer-logo" className="footer-logo" />
            </div>
            <div className="brand">Otter Reliable</div>
          </div>

          <div className="contact-block">
            <div className="label">Email:</div>
            <div className="value">info@otterreliable.com</div>

            <div className="label">Phone:</div>
            <div className="value">208-576-9876</div>

            <div className="label">Address:</div>
            <div className="value small">
              1500 N Eagle Rd, Meridian, ID<br />83646
            </div>
          </div>
        </div>

        <div className="col follow">
          <h3 className="follow-title">Follow us</h3>
          <div className="social-list">
            <SocialIcon imgPath="/social/facebook.png" faClass="fa-brands fa-facebook-f" alt="Facebook" />
            <SocialIcon imgPath="/social/linkedin.png" faClass="fa-brands fa-linkedin-in" alt="LinkedIn" />
            <SocialIcon imgPath="/social/x.png" faClass="fa-brands fa-x-twitter" alt="X" />
            <SocialIcon imgPath="/social/instagram.png" faClass="fa-brands fa-instagram" alt="Instagram" />
            <SocialIcon imgPath="/social/youtube.png" faClass="fa-brands fa-youtube" alt="Youtube" />
          </div>
        </div>

        <div className="col links">
          <h3 className="links-title">Links</h3>
          <ul className="quick-links">
            <li><a href="/" onClick={handleHomeClick}>Home</a></li>
            <li><a href="#About" onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About</a></li>
            <li><a href="#ContactUS" onClick={(e) => { e.preventDefault(); scrollToSection('ContactUS'); }}>Contact</a></li>
            <li><a href="#Gallery" onClick={(e) => { e.preventDefault(); scrollToSection('Gallery'); }}>Gallery</a></li>
            <li><a href="#Services" onClick={(e) => { e.preventDefault(); scrollToSection('Services'); }}>Service</a></li>
          </ul>
        </div>
      </div>

      <div className="divider" />

      <div className="copyright">
        © 2025 Otter Reliable
      </div>
    </footer>
  );
}
