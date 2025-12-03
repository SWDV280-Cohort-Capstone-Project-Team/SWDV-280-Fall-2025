import React from "react";
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
            {/* anchor links to page sections. Make sure your page has elements with matching IDs */}
            <li><a href="#Home">Home</a></li>
            <li><a href="#About">About</a></li>
            <li><a href="#ContactUS">Contact</a></li>
            <li><a href="#Gallery">Gallery</a></li>
            <li><a href="#Services">Service</a></li>
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
