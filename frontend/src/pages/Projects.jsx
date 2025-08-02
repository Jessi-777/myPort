import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Pawfect Plug ',
      // description: ' A personalized SaaS platform delivering eco-friendly pet essentials through smart subscription plans. 
       description:'Led full-stack development, UI/UX design, and built a custom dynamic pricing engine. Focused on sustainability, personalization, and scalable architecture.',
      image: '../pawfect_plug.png',
    },
    {
      id: 2,
      title: 'Challego',
      description: 'Led full-stack development, UI/UX design, and engineered a custom dynamic pricing engine to support personalized, budget-aware shopping. The platform emphasizes environmental impact, user transparency, and scalable architecture to grow with both small vendors and mindful buyers.',
      // image: '/images/project2.jpg',
      image: '../challego1.png'
    },
    {
      id: 3,
      title: 'Farm App',
      description: 'A full-stack farm growing food application with React, TailwindCSS, and Python.',
      // image: '/images/project3.jpg',
      image: '../farm_app.jpg'
    },
    {
        id: 4,
        title: 'Frequency Sounds App',
        description: 'A full-stack application with React, TailwindCSS, and Python.',
        // image: '/images/project1.jpg',
        image: '../frequency.jpeg'
      },
      {
        id: 5,
        title: 'Life Social Media App',
        description: 'A social media platform built with MERN, TailwindCSS and Redux.',
        // image: '/images/project].jpg',
        image: '../life.jpg'
      },
      {
        id: 6,
        title: 'My Expense Tracker',
        description: 'An expense tracker platform built with MERN, TailwindCSS and Redux.',
        // image: '/images/project3.jpg',
        image: '../expense_tracker.jpg'
      },
  ];

  return (
    <section className="min-h-screen flex flex-col bg-white dark:bg-[#1f2227]">
      <div
  className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center"
  style={{
    backgroundImage: "url('/se.jpg')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/30" />

  {/* Text Content */}
  <div className="relative z-10 text-center text-white px-4">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4"> My Projects 💡 </h1>
    <p className="text-base md:text-lg max-w-xl mx-auto">
      Explore Fullstack Development and Designs by Tica aka Jessi.
    </p>
  </div>
</div>
<br/>
{/* background_shop.jpg */}
      <div className="max-w-7xl mx-auto px-6 text-center ">
      {/* <h1 className="text-5xl font-bold text-[#173767] dark:text-white mb-4">💡 My Projects</h1> */}
      {/* <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Explore Fullstack Engineer Projects by Tica aka Jessi.
        </p> */}
        <br/>
        <br/>
        
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <br/>
        <br/>
        <br/>
      </div>
    </section>
  );
};

export default Projects;
