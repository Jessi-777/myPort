import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
  {
     id: '1',
    title: 'Pura Vida Flow App',
    description: 'A modern sound healing and meditation platform built with the MERN stack and TailwindCSS. Users can play relaxing nature sounds, healing frequencies, and set meditation timers in a beautiful, interactive UI. Designed to promote relaxation, mindfulness, and well-being through immersive audio experiences.',
    image: '/flow.png',
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'TailwindCSS'],
    github: '#',
    demo: 'https://sonichealingapp.vercel.app/'
  },
  {
     id: '2',
    title: 'HNA Human Nature Athletica',
    description: 'An ecommerce platform built with MERN, TailwindCSS and Redux.',
    image: '/hna-natureBundle.png',
    tech: ['React', 'Node.js', 'MongoDB', 'Redux', 'TailwindCSS'],
    github: '#',
    demo: 'https://business-app-template1.vercel.app/'

    
  },
  {
    id: '3',
    title: 'The Anchor Book',
    description: 'A short philosophical guide for creators, entrepreneurs, and multi passionate builders who want to create from authenticity true self.',
    // image: '/assets/entry-1.png',
    image: 'https://res.cloudinary.com/dk25jqckw/image/upload/v1781060501/entry-1_fiikjt.png',
    tech: ['JavaScript', 'HTML', 'CSS'],
  //   features: [
  //   "Single-file architecture — no frameworks, no dependencies",
  //   "Cinematic chapter-by-chapter reading experience",
  //   "Responsive design optimized for mobile and desktop",
  //   "Built-in 12-language inline translation engine",
  //   "Deep ocean blue and gold UI with custom animations",
  //   "Zero build process — deploys anywhere with one file upload"
  // ],
    github: '#',
    demo: 'https://jessi-777.github.io/book-one/'
  },
   {
    id: '4',
    title: 'Pawfect Plug SaaS Platform',
    description: 'Led full-stack development, UI/UX design, and built a custom dynamic pricing engine. Focused on sustainability, personalization, and scalable architecture.',
    image: 'https://res.cloudinary.com/dk25jqckw/image/upload/v1787974671/Screenshot_2026-08-28_at_8.37.47_PM_ze4n4r.png',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TailwindCSS'],
    github: '#',
    demo: 'https://pawfectplug.com/'
  },
  // {
   
  // id: '5',
  // title: 'Layers of Reality',
  // description: 'An immersive interactive experience exploring the seven layers of existence through animated diagrams, cosmic interfaces, quizzes, reflections, and philosophical storytelling.',
  // image: '/layers.png',
  // tech: ['JavaScript', 'HTML', 'CSS'],
  // github: '#',
  // demo: 'https://jessi-777.github.io/layers_of_reality/'

  // },
  {
    id: '6',
    title: 'Challego',
    description: 'Led full-stack development, UI/UX design, and engineered a custom dynamic pricing engine to support personalized, eco shopping. The platform emphasizes environmental impact, user transparency, and scalable architecture to grow with both small vendors and mindful buyers.',
    image: '/challego1.png',
    tech: ['React', 'Express', 'MongoDB', 'Redux', 'TailwindCSS'],
    github: '#',
    demo: 'https://my-port-jessi777s-projects.vercel.app/'
  },

    {
    id: '7',
    title: 'Travel Agency App',
    description: 'A travel agency website built using HTML, CSS, and JavaScript. Upon request, I also build this as full stack. It features a responsive and interactive user interface designed to showcase travel destinations, services, and booking style interactions, delivering a smooth and engaging user experience across all devices.',
    // image: '/assets/travel.jpg',
     image: 'https://res.cloudinary.com/dk25jqckw/image/upload/v1781068505/travel_b8pr0n.png',
    tech: ['HTML', 'CSS','Javascript', ],
    github: '#',
    demo: 'https://jessi-777.github.io/Professional_travel_website_platform/'
  },

  //   {
  //   id: '8',
  //   title: 'Currency Conveter',
  //   description: 'A full-stack Farm Management Application built using React for the frontend and Django (REST Framework) for the backend. Features include real-time farm data tracking, secure authentication, role-based access control, and scalable API architecture designed for modern agricultural workflows.',
  //   image: '../currency.jpg',
  //   tech: ['React', 'Python, Django', 'POSTGRESQL', 'Redux', 'TailwindCSS'],
  //   github: '#',
  //   demo: ''
  //   },

];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] via-[#1f2227] to-[#0f1419]">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Project not found</h2>
          <Link to="/projects" className="text-[#96b9c6] hover:text-white transition">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative min-h-screen bg-center bg-cover bg-no-repeat py-20 overflow-hidden"
      style={{ backgroundImage: "url('/se.jpg')" }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-[#96b9c6]/10 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#335099]/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 backdrop-blur-sm text-white rounded-lg border border-white/10 hover:border-[#96b9c6]/50 hover:bg-white/10 transition-all duration-300"
        >
          <FaArrowLeft /> Back to Projects
        </Link>

        {/* Project Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#96b9c6]/20 backdrop-blur-sm rounded-full mb-6 border border-[#96b9c6]/30">
            <span className="text-[#96b9c6] text-sm font-semibold">📁 Project Details</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-[#96b9c6] to-[#335099] bg-clip-text text-transparent">
            {project.title}
          </h1>
        </div>

        {/* Project Image with Gradient Border */}
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <img
            src={project.image}
            alt={project.title}
            className="relative w-full h-[500px] object-contain rounded-2xl shadow-2xl bg-[#0e0f10]"
          />
        </div>

        {/* Project Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">About the Project</h2>
            <p className="text-[#d9dae2] text-lg leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#96b9c6] to-[#335099] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#96b9c6]/50 hover:scale-105 transition-all duration-300"
              >
                <FaGithub /> View Code
              </a> */}
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#335099]/20 text-[#96b9c6] rounded-lg border border-[#96b9c6]/30 font-semibold text-sm hover:scale-105 transition-transform duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Key Features */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <ul className="space-y-3 text-[#d9dae2]">
                <li className="flex items-start gap-2">
                  <span className="text-[#96b9c6] mt-1">✓</span>
                  <span>Full-stack development with modern technologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#96b9c6] mt-1">✓</span>
                  <span>Responsive design for all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#96b9c6] mt-1">✓</span>
                  <span>Scalable architecture and clean code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#96b9c6] mt-1">✓</span>
                  <span>User-focused UI/UX design</span>
                </li>
              </ul>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;




