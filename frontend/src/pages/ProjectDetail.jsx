// src/pages/ProjectDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const projects = [
  {
    id: '1',
    title: 'Pawfect Plug',
    description: 'Led full-stack development, UI/UX design, and built a custom dynamic pricing engine. Focused on sustainability, personalization, and scalable architecture.',
    image: '../pawfect_plug.png',
  },
  {
    id: '2',
    title: 'Challego',
    description: 'Led full-stack development, UI/UX design, and engineered a custom dynamic pricing engine to support personalized, eco shopping. The platform emphasizes environmental impact, user transparency, and scalable architecture to grow with both small vendors and mindful buyers.',
    image: '../challego1.png',
  },
  // {
  //   id: '3',
  //   title: 'Farm App',
  //   description: 'A full-stack farm growing food application with React, TailwindCSS, and Python.',
  //   image: '../farm_app.jpg',
  // },
  // {
  //   id: '4',
  //   title: 'Frequency Sounds App',
  //   description: 'A full-stack application with React, TailwindCSS, and Python.',
  //   image: '../frequency.jpeg',
  // },
  {
    id: '5',
    title: 'Life Social Media App',
    description: 'A social media platform built with MERN, TailwindCSS and Redux.',
    image: '../life.jpg',
  },
  {
    id: '6',
    title: ' HNA Human Nature Atheltica',
    description: 'An ecommerce platform built with MERN, TailwindCSS and Redux.',
    image: '../expense_tracker.jpg',
  },
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="text-center py-20 text-red-500">
        Project not found.
      </div>
    );
  }

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




