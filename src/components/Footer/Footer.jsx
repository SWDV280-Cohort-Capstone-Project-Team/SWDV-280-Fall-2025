import React from "react";
import "./Footer.css";
import Logo from '../../assets/Icons/logo.png';
import { HashLink as Link } from 'react-router-hash-link';
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
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site footer">
      <div className="footer-inner">
        <div className="col contact">
          <div className="logo-wrap">
            <div className="logo-circle">
              {/* public/logo.png — MUST be in public folder */}
              <img src={Logo} alt="footer-logo" className="footer-logo" />
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
            <a href="https://facebook.com/OtterReliable" target="_blank" rel="noopener noreferrer">
                <SocialIcon imgPath="/social/facebook.png" faClass="fa-brands fa-facebook-f" alt="Facebook" />
            </a>
            
            <a href="https://linkedin.com/company/OtterReliable" target="_blank" rel="noopener noreferrer">
                <SocialIcon imgPath="/social/linkedin.png" faClass="fa-brands fa-linkedin-in" alt="LinkedIn" />
            </a>
            
            <a href="https://twitter.com/OtterReliable" target="_blank" rel="noopener noreferrer">
                <SocialIcon imgPath="/social/x.png" faClass="fa-brands fa-x-twitter" alt="X" />
            </a>
            
            <a href="https://instagram.com/OtterReliable" target="_blank" rel="noopener noreferrer">
                <SocialIcon imgPath="/social/instagram.png" faClass="fa-brands fa-instagram" alt="Instagram" />
            </a>
            
            <a href="https://youtube.com/OtterReliable" target="_blank" rel="noopener noreferrer">
                <SocialIcon imgPath="/social/youtube.png" faClass="fa-brands fa-youtube" alt="Youtube" />
            </a>
          </div>
        </div>

        <div className="col links">
          <h3 className="links-title">Links</h3>
          <ul className="quick-links">
            <li><Link to="/#Home">Home</Link></li>
            <li><Link to="/#About">About</Link></li>
            <li><Link to="/#ContactUS">Contact</Link></li>
            <li><Link to="/#Gallery">Gallery</Link></li>
            <li><Link to="/#Services">Service</Link></li>
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
