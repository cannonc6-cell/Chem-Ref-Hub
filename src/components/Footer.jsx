import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/chemicals">Chemical Database</Link></li>
              <li><Link to="/add-chemical">Add Chemical</Link></li>
              <li><Link to="/logbook">Chemical Logbook</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Learn</h3>
            <ul>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/glossary">Glossary</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li>Emergency: 911</li>
              <li>Lab Supervisor: (555) 000-0000</li>
              <li>Safety Officer: (555) 000-0001</li>
              <li>Email: safety@chemref.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ChemRef Hub. All rights reserved.</p>
          <p className="footer-version">Version 1.3.1</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
