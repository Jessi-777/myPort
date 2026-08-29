import React from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaCode,
  FaPalette,
  FaRocket,
  FaFilm,
  FaMusic,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const About = () => {
  return (
    <section
      className="relative py-20 bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/black.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* =========================
            INTRO
        ========================== */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-20">

          {/* Image */}
          <div className="flex-1 mb-10 md:mb-0">
            <div className="relative group">

              <div
                className="
                  absolute -inset-1
                  bg-gradient-to-r
                  from-[#96b9c6]
                  to-[#335099]
                  rounded-2xl
                  blur
                  opacity-25
                  group-hover:opacity-50
                  transition
                  duration-500
                "
              ></div>

              <img
                src="https://res.cloudinary.com/ninjagrvl/image/upload/v1778891381/nl6awplmlb1soypsdsue.jpg"
                alt="Jessi Chavez — full-stack software engineer and product builder"
                className="
                  relative
                  w-full
                  max-w-lg
                  mx-auto
                  md:mx-0
                  rounded-2xl
                  shadow-2xl
                  transform
                  group-hover:scale-105
                  transition
                  duration-500
                "
              />
            </div>
          </div>

          {/* Intro Text */}
          <div className="flex-1 text-center md:text-left">

            <div className="inline-block px-4 py-2 bg-[#96b9c6]/20 backdrop-blur-sm rounded-full mb-4 border border-[#96b9c6]/30">
              <span className="text-[#96b9c6] text-sm font-semibold">
                ✨ Open to Opportunities
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              T!CA aka Jessi Chavez
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-[#96b9c6] mb-8">
              FULL-STACK SOFTWARE ENGINEER
              <br />
              PRODUCT BUILDER • CREATIVE TECHNOLOGIST
            </h2>

            <div className="space-y-6 text-lg text-[#d9dae2] leading-relaxed">

              <p>
                <span className="text-white font-semibold">
                  I build platforms with intention
                </span>
                , focusing on clarity, usability, and long term reliability.
                My work is rooted in thoughtful engineering and designing
                systems that are easy to understand, operate, and trust.
              </p>

              <p>
                I approach each project by aligning{' '}
                <span className="text-white font-semibold">
                  strategy, architecture, and interface design
                </span>{' '}
                to create exceptional user experiences. This allows me to build
                scalable full-stack systems and refined interfaces that feel
                effortless from the inside out.
              </p>

              <p>
                Whether developing full-scale applications, SaaS products, or
                e-commerce platforms, I bring a balanced perspective that
                combines{' '}
                <span className="text-white font-semibold">
                  technical depth
                </span>
                ,{' '}
                <span className="text-white font-semibold">
                  design sensibility
                </span>
                , and{' '}
                <span className="text-white font-semibold">
                  strategic thinking
                </span>{' '}
                to create digital products built to last.
              </p>

              <p>
                <span className="text-white font-semibold">
                  From architecture and backend systems to responsive interfaces
                  and production deployment, I take ownership of the full
                  product lifecycle.
                </span>
              </p>

            </div>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 mt-8">

              <a
                href="https://github.com/Jessi-777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  w-12 h-12
                  flex items-center justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  hover:bg-[#96b9c6]
                  hover:scale-110
                  transition-all
                  duration-300
                  text-xl
                "
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  w-12 h-12
                  flex items-center justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  hover:bg-[#96b9c6]
                  hover:scale-110
                  transition-all
                  duration-300
                  text-xl
                "
              >
                <FaLinkedin />
              </a>

              <a
                href="https://x.com/IamTicaRey"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="
                  w-12 h-12
                  flex items-center justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  hover:bg-[#96b9c6]
                  hover:scale-110
                  transition-all
                  duration-300
                "
              >
                <FaXTwitter className="text-xl" />
              </a>

            </div>
          </div>
        </div>

        {/* =========================
            CORE CAPABILITIES
        ========================== */}

        <div className="mb-20">

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Core Capabilities
            </h2>

            <p className="text-[#d9dae2] mt-3 max-w-2xl mx-auto">
              I combine engineering, design, and product thinking to build
              complete digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Engineering */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:scale-105">

              <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
                <FaCode className="text-2xl text-[#96b9c6]" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Full-Stack Engineering
              </h3>

              <p className="text-[#d9dae2] leading-relaxed">
                React, JavaScript, Node.js, Express, MongoDB, PostgreSQL,
                REST APIs, authentication, RBAC, Stripe, webhooks,
                third-party integrations, and cloud deployment.
              </p>
            </div>

            {/* Design */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:scale-105">

              <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
                <FaPalette className="text-2xl text-[#96b9c6]" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                UI/UX & Visual Design
              </h3>

              <p className="text-[#d9dae2] leading-relaxed">
                Figma, responsive design, visual systems, interaction design,
                branding, digital experiences, and translating concepts into
                polished interfaces.
              </p>
            </div>

            {/* Product */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#96b9c6]/50 transition-all duration-300 hover:scale-105">

              <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center mb-4">
                <FaRocket className="text-2xl text-[#96b9c6]" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                Product Thinking
              </h3>

              <p className="text-[#d9dae2] leading-relaxed">
                Product strategy, MVP development, architecture, user
                workflows, SaaS, e-commerce, business systems, and
                end-to-end product ownership.
              </p>
            </div>

          </div>
        </div>

        {/* =========================
            CREATIVE TECHNOLOGY
        ========================== */}

        <div>

          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Creative Technology
            </h2>

            <p className="text-[#d9dae2] mt-3 max-w-2xl mx-auto">
              My engineering work is complemented by years of experience
              creating across film, music, audio, and visual media.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Film */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">

              <div className="flex items-center gap-4 mb-4">

                <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center">
                  <FaFilm className="text-2xl text-[#96b9c6]" />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Film & Video
                </h3>

              </div>

              <p className="text-[#d9dae2] leading-relaxed">
                Filming, production, editing, visual storytelling, promotional
                content, and creative direction.
              </p>

            </div>

            {/* Music */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">

              <div className="flex items-center gap-4 mb-4">

                <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center">
                  <FaMusic className="text-2xl text-[#96b9c6]" />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Music & Audio
                </h3>

              </div>

              <p className="text-[#d9dae2] leading-relaxed">
                Music production, recording, sound engineering, mixing,
                mastering, and audio post-production.
              </p>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;

