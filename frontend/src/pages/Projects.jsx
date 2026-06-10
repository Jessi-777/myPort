import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
       id: '1',
      title: 'Pura Vida Flow App',
      description: 'A modern sound healing and meditation platform built with the MERN stack and TailwindCSS. Users can play relaxing nature sounds, healing frequencies, and set meditation timers in a beautiful, interactive UI. Designed to promote relaxation, mindfulness, and well-being through immersive audio experiences.',
      image: '/flow.png'
    },
    {
      id: '2',
      title: 'HNA Human Nature Athletica',
      description: 'HNA is a modern eCommerce platform built with the MERN stack, TailwindCSS, and Redux, delivering a fast, responsive shopping experience with seamless state management and a clean, scalable UI.',
      image: '/hna-natureBundle.png',
    },
     {
      id: '3',
      title: 'The Anchor Book',
      description: 'A standalone HTML book experience built for the authentic builder. Nine motivational entries, cinematic ocean blue and gold design, 12 language translation support, and zero dependencies. One file. Runs anywhere.',
      image: 'https://res.cloudinary.com/dk25jqckw/image/upload/v1781060501/the-anchor_iaggt3.png'
    },

    // {
    //   id: '3',
    //   title: 'Set your Intentions',
    //   description: 'A fast, modern affirmation home built with HTML, CSS, and JavaScript.',
    //   image: '/intentions.png'
    // },
    {
      id: '4',
      title: 'Pawfect Plug SaaS Platform',
      description:'Led full-stack development, UI/UX design, and built a custom dynamic pricing engine. Focused on sustainability, personalization, and scalable architecture.',
      image: '/pawfect_plug.png',
    },
    // {
    //   id: '5',
    //   title: 'Layers of Reality',
    //   description: 'Layers of Reality diagram, descrpition, and tests.',
    //   image: '/layers.png'
    // },
    {
      id: '6',
      title: 'Challego online Market',
      description: 'Led full-stack development, UI/UX design, and engineered a custom dynamic pricing engine to support personalized, budget-aware shopping. The platform emphasizes environmental impact, user transparency, and scalable architecture to grow with both small vendors and mindful buyers.',
      image: '/challego1.png'
    },
     {
      id: '7',
      title: 'Travel Agency',
      description: 'Happy Travels is a modern, responsive travel agency website built with HTML, CSS, and JavaScript. It showcases destinations, travel packages, and booking style interactions through a clean, user friendly interface designed for smooth navigation and an engaging browsing experience.',
      image: 'https://res.cloudinary.com/dk25jqckw/image/upload/v1781068505/travel_b8pr0n.png'
    },

     //  {
    //   id: '8',
    //   title: 'The Anchor Book',
    //   description: 'Currency Converter is a modern, responsive travel agency website built with HTML, CSS, and JavaScript. It showcases destinations, travel packages, and booking style interactions through a clean, user friendly interface designed for smooth navigation and an engaging browsing experience.',
    //   image: '/currency.jpg'
    // },

    //  {
    //   id: '9',
    //   title: 'Currency Converter',
    //   description: 'Currency Converter is a modern, responsive travel agency website built with HTML, CSS, and JavaScript. It showcases destinations, travel packages, and booking style interactions through a clean, user friendly interface designed for smooth navigation and an engaging browsing experience.',
    //   image: '/currency.jpg'
    // },
    
  ];

  return (
    <section className="relative min-h-screen bg-center bg-cover bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/se.jpg')" }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-[#a9d0de]/10 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#08184e]/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#a9d0de]/20 backdrop-blur-sm rounded-full mb-6 border border-[#a9d0de]/30">
            <span className="text-[#a9d0de] text-sm font-semibold">💡 Portfolio Showcase</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-[#6078a7] to-[#08184e] bg-clip-text text-transparent drop-shadow-2xl">
            My Projects
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Built <span className="text-[#a9d0de] font-bold">Full-Stack SaaS Platforms </span> designed to scale, connect APIs seamlessly, and deliver smooth, intuitive user experiences. Also Included <span className="text-[#a9d0de] font-bold"> HTML, CSS and Javascript Projects </span> Crafted with precision, creativity, and performance in mind.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;