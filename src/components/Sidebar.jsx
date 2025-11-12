import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import profileImage from '../assets/profile.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/ask-me-anything" className={({ isActive }) => (isActive ? 'active' : '')}>
              Ask Anything
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={({ isActive }) => (isActive ? 'active' : '')}>
              My Bookshelf
            </NavLink>
          </li>
          <li>
            <NavLink to="/software" className={({ isActive }) => (isActive ? 'active' : '')}>
              Software I Like
            </NavLink>
          </li>
          {/*
          <li>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
              Blog
            </NavLink>
          </li>
          */}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <img src={profileImage} alt="Profile" className="profile-image" />
        Designed by{' '}
        <a
          href="https://github.com/azariak"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Azaria Kelman
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
