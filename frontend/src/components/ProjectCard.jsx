
// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  if (!project) {
    console.error('No project data available');
    return <div>Error: No project data available!</div>;
  }

  const { image, title, description, id } = project;

  if (!image || !title || !description) {
    console.error('Missing project data: ', project);
    return <div>Error: Project is missing some data!</div>;
  }

  return (
    
    // home project cards
    // [#161f33] 
    <div className="p-6 bg-[#0e0f10] backdrop-filter backdrop-blur-sm bg-opacity-1 border border-gray-800
      h-full w-full bg-clip-padding bg-opacity-80 
      rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
      {/* Project Image */}
      <img src={image} alt={title} className="w-full h-48 object-contain rounded-2xl mb-4" />
      
      {/* Project Title */}
      <h3 className="text-xl font-semibold text-[#e4e7ee] mb-2 text-center">{title}</h3>
      
      {/* Project Description */}
      <p className="text-gray-400 mb-7 text-center">{description}</p>

      {/* View Project Button */}
      <div className="flex justify-center">
        <Link
          to={`/projects/${id}`}
          className="px-6 py-3 text-white font-semibold rounded-lg shadow-[0_0_px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center transition duration-300 transform hover:scale-105"
          style={{
          backgroundImage: "url('space.jpg')"
        }}>
          View Project
        </Link>
      </div>

      <br/>
      <br/>
    </div>
  );
};

export default ProjectCard;

