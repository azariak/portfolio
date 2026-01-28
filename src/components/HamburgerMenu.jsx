import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './HamburgerMenu.css';
import { analytics } from '../utils/analytics';
import profileImage from '../assets/profile.png';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (destination) => {
    analytics.navClick(destination);
    toggleMenu();
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
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Home')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/terminal" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Terminal')}>
                Command Line
              </NavLink>
            </li>
            <li>
              <NavLink to="/ask" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Ask Anything')}>
                Ask Anything
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Projects')}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/books" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Books')}>
                My Bookshelf
              </NavLink>
            </li>
            <li>
              <NavLink to="/software" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Software')}>
                Software I Like
              </NavLink>
            </li>
            {/*
            <li>
              <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => handleNavClick('Blog')}>
                Blog
              </NavLink>
            </li>
            */}
          </ul>
        </nav>
        <div className="mobile-nav-footer">
          <img src={profileImage} alt="Profile" className="mobile-profile-image" />
          Designed by{' '}
          <a
            href="https://github.com/azariak"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-footer-link"
          >
            Azaria Kelman
          </a>
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default HamburgerMenu;
