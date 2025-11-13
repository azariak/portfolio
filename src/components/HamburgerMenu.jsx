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
              <NavLink to="/ask" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Ask Anything
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/books" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                My Bookshelf
              </NavLink>
            </li>
            <li>
              <NavLink to="/software" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Software I Like
              </NavLink>
            </li>
            {/*
            <li>
              <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
                Blog
              </NavLink>
            </li>
            */}
          </ul>
        </nav>
      </div>
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default HamburgerMenu;
