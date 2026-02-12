import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import profileImage from '../assets/profile.png';
import { analytics } from '../utils/analytics';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Home')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/terminal" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Terminal')}>
              Command Line <span style={{ opacity: 0.6, fontSize: '0.85em' }}>(Press /)</span>
            </NavLink>
          </li>
          {/*<li>
            <NavLink to="/ask" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Ask Anything')}>
              Ask Anything
            </NavLink>
          </li>*/}
          <li>
            <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Projects')}>
              Projects
            </NavLink>
          </li>
          {/*<li>
            <NavLink to="/books" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Books')}>
              My Bookshelf
            </NavLink>
          </li>*/}
          <li>
            <NavLink to="/software" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Software')}>
              Software I Like
            </NavLink>
          </li>
          {/*
          <li>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => analytics.navClick('Blog')}>
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
