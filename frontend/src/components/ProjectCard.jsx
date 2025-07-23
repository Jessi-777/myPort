
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
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-2xl mb-4" />
      
      {/* Project Title */}
      <h3 className="text-xl font-semibold text-[#e4e7ee] mb-2">{title}</h3>
      
      {/* Project Description */}
      <p className="text-gray-400 mb-7">{description}</p>

      {/* View Project Button */}

      <Link
        to={`/projects/${id}`}
        className="px-6 py-3 text-white font-semibold rounded-lg shadow-[0_0_px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center transition duration-300 transform hover:scale-105"
        style={{
        backgroundImage: "url('space.jpg')"
      }}>
        View Project
      </Link>


      {/* <Link
        to={`/projects/${id}`} // Dynamically link to the specific project page
        className="px-6 py-3 bg-[#405f92] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1f3a5a] transition duration-300 transform hover:scale-105"
      >
        View Project
      </Link> */}
      <br/>
      <br/>
    </div>
  );
};

export default ProjectCard;



// // src/components/ProjectCard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProjectCard = ({ project }) => {
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
//       {/* Project Image */}
//       <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
      
//       {/* Project Title */}
//       <h3 className="text-xl font-semibold text-[#173767] mb-2">{project.title}</h3>
      
//       {/* Project Description */}
//       <p className="text-gray-600 mb-4">{project.description}</p>

//       {/* View Project Button */}
//       <Link
//         to={`/projects/${project.id}`} // Dynamically link to the specific project page
//         className="px-6 py-3 bg-[#173767] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1f3a5a] transition duration-300 transform hover:scale-105"
//       >
//         View Project
//       </Link>
//     </div>
//   );
// };

// export default ProjectCard;



// src/components/ProjectCard.jsx
// import React from 'react';

// const ProjectCard = ({ title, description, image, tags, link }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
//       <img src={image} alt={title} className="w-full h-48 object-cover" />
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-[#173767]">{title}</h3>
//         <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
//         <div className="flex flex-wrap mt-4 gap-2">
//           {tags.map((tag, i) => (
//             <span key={i} className="text-sm bg-[#173767] text-white px-2 py-1 rounded-full">
//               {tag}
//             </span>
//           ))}
//         </div>
//         <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-[#173767] hover:underline">
//           View Project →
//         </a>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;



// import React, { useState } from 'react';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Form submission logic here (e.g. send to backend or API)
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-[#0e1a2b] via-[#1e3a5f] to-[#1c2e4a] py-20 px-4 flex items-center justify-center">
//       <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-white">
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-white">
//           Investor Contact
//         </h1>
//         <p className="text-lg text-center mb-10 text-gray-200">
//           Interested in investing in <span className="font-semibold text-white">Pawfect Plug</span>? We'd love to hear from you.
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email Address"
//             className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
//             required
//           />
//           <textarea
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             placeholder="Your Message"
//             rows={5}
//             className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full py-3 text-xl font-semibold bg-white text-[#173767] rounded-full hover:bg-gray-100 transition-all duration-300"
//           >
//             Send Message
//           </button>
//         </form>
//         <div className="mt-10 text-center text-sm text-gray-300">
//           Or email us directly at <a href="mailto:invest@pawfectplug.com" className="underline hover:text-white">invest@pawfectplug.com</a>
//         </div>
//         <div className="mt-4 text-center">
//           <a
//             href="/pitch-deck.pdf"
//             className="inline-block mt-4 px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-[#173767] transition-all duration-300"
//             target="_blank" rel="noopener noreferrer"
//           >
//             Download Pitch Deck
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Contact;


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
//     <div className="p-6 bg-[#161f33] 
//       h-full w-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-900
//       rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
//       {/* Project Image */}
//       <img src={image} alt={title} className="w-full h-48 object-cover rounded-2xl mb-4" />
      
//       {/* Project Title */}
//       <h3 className="text-xl font-semibold text-[#e4e7ee] mb-2">{title}</h3>
      
//       {/* Project Description */}
//       <p className="text-gray-400 mb-7">{description}</p>

//       {/* View Project Button */}

//       <Link
//         to={`/projects/${id}`}
//         className="px-6 py-3 text-white font-semibold rounded-lg shadow-[0_0_px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-cover bg-center transition duration-300 transform hover:scale-105"
//         style={{
//         backgroundImage: "url('space.jpg')"
//       }}>
//         View Project
//       </Link>


//       {/* <Link
//         to={`/projects/${id}`} // Dynamically link to the specific project page
//         className="px-6 py-3 bg-[#405f92] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1f3a5a] transition duration-300 transform hover:scale-105"
//       >
//         View Project
//       </Link> */}
//       <br/>
//       <br/>
//     </div>
//   );
// };

// export default ProjectCard;



// // src/components/ProjectCard.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProjectCard = ({ project }) => {
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
//       {/* Project Image */}
//       <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
      
//       {/* Project Title */}
//       <h3 className="text-xl font-semibold text-[#173767] mb-2">{project.title}</h3>
      
//       {/* Project Description */}
//       <p className="text-gray-600 mb-4">{project.description}</p>

//       {/* View Project Button */}
//       <Link
//         to={`/projects/${project.id}`} // Dynamically link to the specific project page
//         className="px-6 py-3 bg-[#173767] text-white font-semibold rounded-lg shadow-lg hover:bg-[#1f3a5a] transition duration-300 transform hover:scale-105"
//       >
//         View Project
//       </Link>
//     </div>
//   );
// };

// export default ProjectCard;



// src/components/ProjectCard.jsx
// import React from 'react';

// const ProjectCard = ({ title, description, image, tags, link }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
//       <img src={image} alt={title} className="w-full h-48 object-cover" />
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-[#173767]">{title}</h3>
//         <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
//         <div className="flex flex-wrap mt-4 gap-2">
//           {tags.map((tag, i) => (
//             <span key={i} className="text-sm bg-[#173767] text-white px-2 py-1 rounded-full">
//               {tag}
//             </span>
//           ))}
//         </div>
//         <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-[#173767] hover:underline">
//           View Project →
//         </a>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;
