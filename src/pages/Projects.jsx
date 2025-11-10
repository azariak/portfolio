import React from 'react';
import Card from '../components/Card';
import projectsData from '../data/projects.json';
import './Projects.css';

const Projects = () => {
  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <div className="card-grid">
        {projectsData.map((project, index) => (
          <Card
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
