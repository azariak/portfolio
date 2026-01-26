import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Popup from '../components/Popup';
import projectsData from '../data/projects.json';
import './Projects.css';

const Projects = () => {
  const [popupUrl, setPopupUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    document.title = 'Azaria Kelman - Projects';
  }, []);

  // Filter out hidden projects
  const visibleProjects = projectsData.filter(project => !project.hidden);

  // Projects that should open in new tabs instead of popups
  const projectsWithoutPopup = ['Lichess Open-Source Contributions'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openPopup = (url) => {
    setPopupUrl(url);
  };

  const closePopup = () => {
    setPopupUrl(null);
  };

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <div className="card-grid">
        {visibleProjects.map((project, index) => (
          <Card
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
            onLearnMoreClick={projectsWithoutPopup.includes(project.title) ? undefined : openPopup}
            isMobile={isMobile}
            trackingCategory="projects"
          />
        ))}
      </div>
      <div className="projects-footer">
        <a href="https://github.com/azariak" target="_blank" rel="noopener noreferrer">
          See my GitHub for more!
        </a>
      </div>
      {popupUrl && <Popup url={popupUrl} onClose={closePopup} />}
    </div>
  );
};

export default Projects;
