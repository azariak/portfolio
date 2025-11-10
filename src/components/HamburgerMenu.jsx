import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
      <button className="hamburger-icon" onClick={toggleMenu}>
        <div className={`icon-bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`icon-bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`icon-bar ${isOpen ? 'open' : ''}`}></div>
      </button>
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/things-i-read" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Things I Read
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default HamburgerMenu;
