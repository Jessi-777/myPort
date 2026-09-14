// src/pages/Projects.jsx

import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
      id: '4',
      title: 'Pawfect Plug SaaS Platform',
      category: 'SaaS • Full-Stack',
      description:
        'Full-stack subscription platform featuring personalized product workflows, dynamic pricing, Stripe billing, authentication, administrative tools, and scalable product architecture.',
      image:
        'https://res.cloudinary.com/dk25jqckw/image/upload/v1787974671/Screenshot_2026-08-28_at_8.37.47_PM_ze4n4r.png',
      tech: [
        'React',
        'Node.js',
        'Express',
        'MongoDB',
        'Stripe',
        'TailwindCSS',
      ],
    },

    {
      id: '2',
      title: 'HNA — Human Nature Athletica',
      category: 'E-Commerce • Full-Stack',
      description:
        'Full-stack e-commerce platform designed around scalable product management, responsive shopping experiences, state management, and modern digital commerce workflows.',
      image: '/hna-natureBundle.png',
      tech: [
        'React',
        'Node.js',
        'Express',
        'MongoDB',
        'Redux',
        'TailwindCSS',
      ],
    },

    {
      id: '1',
      title: 'Pura Vida Flow',
      category: 'Digital Product • Full-Stack',
      description:
        'Interactive sound-healing and meditation platform combining audio experiences, responsive UI, user-focused workflows, and full-stack application architecture.',
      image: '/flow.png',
      tech: [
        'React',
        'Node.js',
        'Express',
        'MongoDB',
        'TailwindCSS',
        'Audio',
      ],
    },

    // {
    //   id: '6',
    //   title: 'Challego Online Market',
    //   category: 'E-Commerce • Full-Stack',
    //   description:
    //     'E-commerce marketplace concept focused on personalized, budget-aware shopping with dynamic pricing, vendor workflows, product management, and scalable architecture.',
    //   image: '/challego1.png',
    //   tech: [
    //     'React',
    //     'Node.js',
    //     'Express',
    //     'MongoDB',
    //     'REST APIs',
    //     'TailwindCSS',
    //   ],
    // },

    {
      id: '3',
      title: 'The Anchor Book',
      category: 'Digital Product • JavaScript',
      description:
        'Standalone digital book experience built as a lightweight, dependency-free web application with multilingual support, cinematic visual design, and responsive presentation.',
      image:
        'https://res.cloudinary.com/dk25jqckw/image/upload/v1781060501/the-anchor_iaggt3.png',
      tech: [
        'HTML',
        'CSS',
        'JavaScript',
        'Responsive Design',
        'i18n',
      ],
    },

    {
      id: '7',
      title: 'Happy Travels',
      category: 'Web Application • Frontend',
      description:
        'Responsive travel experience featuring destination discovery, travel packages, booking-style interactions, and a user-focused interface built for smooth navigation.',
      image:
        'https://res.cloudinary.com/dk25jqckw/image/upload/v1781068505/travel_b8pr0n.png',
      tech: [
        'HTML',
        'CSS',
        'JavaScript',
        'Responsive UI',
        'UX Design',
      ],
    },
  ];

  return (
    <section
      className="
        relative
        min-h-screen
        bg-center
        bg-cover
        bg-no-repeat
        overflow-hidden
      "
      style={{ backgroundImage: "url('/se.jpg')" }}
    >
      {/* Background Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-[#1a1d23]/97
          to-[#2e333a]/94
        "
      />

      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="
            absolute
            w-96 h-96
            bg-[#a9d0de]/10
            rounded-full
            blur-3xl
            top-20
            left-10
            animate-pulse
          "
        />

        <div
          className="
            absolute
            w-96 h-96
            bg-[#08184e]/10
            rounded-full
            blur-3xl
            bottom-20
            right-10
            animate-pulse
          "
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-20 px-6">

        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-16">

          <div
            className="
              inline-flex
              items-center
              px-4 py-2
              bg-[#a9d0de]/10
              backdrop-blur-sm
              rounded-full
              mb-6
              border border-[#a9d0de]/20
            "
          >
            <span className="text-[#a9d0de] text-sm font-semibold">
              Engineering Portfolio
            </span>
          </div>

          <h1
            className="
              text-5xl
              md:text-7xl
              font-extrabold
              mb-6
              bg-gradient-to-r
              from-white
              via-[#a9d0de]
              to-[#6078a7]
              bg-clip-text
              text-transparent
              drop-shadow-2xl
            "
          >
            Selected Projects
          </h1>

          <p
            className="
              text-lg
              md:text-xl
              max-w-3xl
              mx-auto
              text-gray-300
              leading-relaxed
            "
          >
            I design and build{' '}
            <span className="text-[#a9d0de] font-semibold">
              full-stack applications, SaaS platforms, and digital products
            </span>{' '}
            from architecture through production combining engineering,
            product thinking, and UI/UX design.
          </p>
        </div>

        {/* Projects */}
        <div className="max-w-7xl mx-auto">

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Projects;

