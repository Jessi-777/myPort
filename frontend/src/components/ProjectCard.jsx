// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCode } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  if (!project) {
    console.error('No project data available');
    return null;
  }

  const {
    image,
    title,
    description,
    id,
    tech = [],
    category = 'Full-Stack Project',
  } = project;

  if (!image || !title || !description) {
    console.error('Missing project data:', project);
    return null;
  }

  return (
    <article
      className="
        group relative flex flex-col h-full
        bg-[#0b0d10]/95
        border border-white/10
        rounded-2xl
        overflow-hidden
        shadow-xl
        transition-all duration-500
        hover:-translate-y-2
        hover:border-[#96b9c6]/40
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#111318]">
        <img
          src={image}
          alt={`${title} project`}
          className="
            w-full h-52
            object-contain
            p-4
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* Image overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-[#0b0d10]/70
            via-transparent
            to-transparent
            pointer-events-none
          "
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">

        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#96b9c6]">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-6 mb-5">
          {description}
        </p>

        {/* Tech Stack */}
        {tech.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <FaCode />
              Tech Stack
            </div>

            <div className="flex flex-wrap gap-2">
              {tech.map((item) => (
                <span
                  key={item}
                  className="
                    px-2.5 py-1
                    rounded-md
                    text-xs
                    font-medium
                    text-[#cbd5e1]
                    bg-white/5
                    border border-white/10
                  "
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Button */}
        <Link
          to={`/projects/${id}`}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            w-full
            px-5 py-3
            rounded-lg
            bg-gradient-to-r
            from-[#96b9c6]
            to-[#335099]
            text-white
            font-semibold
            text-sm
            transition-all duration-300
            hover:shadow-[0_0_25px_rgba(150,185,198,0.25)]
            hover:scale-[1.02]
          "
        >
          View Case Study
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;


// // src/components/ProjectCard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProjectCard = ({ project }) => {
//   if (!project) {
//     console.error('No project data available');
//     return <div>Error: No project data available!</div>;
//   }

//   const { image, title, description, id } = project;

//   if (!image || !title || !description) {
//     console.error('Missing project data: ', project);
//     return <div>Error: Project is missing some data!</div>;
//   }

//   return (
    
//     // home project cards
//     // [#161f33] 
//     <div className="p-6 bg-[#0e0f10] backdrop-filter backdrop-blur-sm bg-opacity-1 border border-gray-800
//       h-full w-full bg-clip-padding bg-opacity-80 
//       rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
//       {/* Project Image */}
//       <img src={image} alt={title} className="w-full h-48 object-contain rounded-2xl mb-4" />
      
//       {/* Project Title */}
//       <h3 className="text-xl font-semibold text-[#e4e7ee] mb-2 text-center">{title}</h3>
      
//       {/* Project Description */}
//       <p className="text-gray-400 mb-7 text-center">{description}</p>

//       {/* View Project Button */}
//       <div className="flex justify-center">
//         <Link
//           to={`/projects/${id}`}
//           className="px-6 py-3 text-white font-semibold rounded-lg shadow-[0_0_px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center transition duration-300 transform hover:scale-105"
//           style={{
//           backgroundImage: "url('space.jpg')"
//         }}>
//           View Project
//         </Link>
//       </div>

//       <br/>
//       <br/>
//     </div>
//   );
// };

// export default ProjectCard;

