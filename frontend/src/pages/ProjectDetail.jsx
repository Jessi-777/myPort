// src/pages/ProjectDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();

  // mock example
  const project = {
    id: projectId,
    title: `Project ${projectId}`,
    description: `Detailed information about Project ${projectId}.`,
    image: '/space.jpg', 
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
            <h2 className="text-4xl font-bold text-[#173767] mb-4">{project.title}</h2>
            <p className="text-lg text-gray-700">{project.description}</p>
          </div>
        </section>
      </main>

 
      <footer className="bg-[#1f2227] text-white text-center py-6">
        © {new Date().getFullYear()} T!CA
      </footer>
    </div>
  );
};

export default ProjectDetail;



// // src/pages/ProjectDetail.jsx
// import React from 'react';
// import { useParams } from 'react-router-dom';

// const ProjectDetail = () => {
//   const { projectId } = useParams(); // Get the project ID from the URL
//   // In a real app, you might fetch the project details from an API using the projectId
//   const project = {
//     id: projectId,
//     title: `Project ${projectId}`,
//     description: `Detailed information about Project ${projectId}.`,
//     // image: '/images/project1.jpg',
//     image: '../space.jpg',

//   };

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-4xl mx-auto px-6 text-center">
//         <img src={project.image} alt={project.title} className="w-full h-96 object-cover rounded-lg mb-6" />
//         <h2 className="text-4xl font-bold text-[#173767] mb-4">{project.title}</h2>
//         <p className="text-lg text-gray-700">{project.description}</p>
//       </div>
//     </section>
//   );
// };

// export default ProjectDetail;
