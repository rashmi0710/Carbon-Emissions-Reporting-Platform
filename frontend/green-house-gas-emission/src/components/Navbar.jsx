import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <FontAwesomeIcon icon={faCloud} size="2x" color="white" /> 
          <span className="logo-text">CO₂ Tracker</span>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-emission" className={({ isActive }) => (isActive ? "active" : "")}>
              Add Emission
            </NavLink>
          </li>
          <li>
            <NavLink to="/metrics" className={({ isActive }) => (isActive ? "active" : "")}>
              Business Metrics
            </NavLink>
          </li>
          <li>
            <NavLink to="/audit" className={({ isActive }) => (isActive ? "active" : "")}>
              Audit Logs
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
