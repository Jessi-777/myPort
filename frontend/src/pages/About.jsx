import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const About = () => {
  return (
    // [#96b9c6]
    // [#494b54]
    <section
      className="relative py-20 bg-center bg-cover bg-no-repeat bg-gradient-to-r from-[#2e333a] to-[#7e8f9d]"
      style={{ backgroundImage: "url('/black.jpg')" }} // replace with your actual image path
    >
    {/* <section className="relative py-20 bg-gradient-to-r from-[#2d2d2f] to-[#808a9c]">
      {/* Background gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#576c85] to-[#758fb6] opacity-10 z-0"></div> */} 

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Image Left */}
        <div className="flex-1 mb-10 md:mb-0 md:mr-10">
          <img
            src="/tica1.jpg"
            alt="Tica working"
            className="w-full max-w-sm mx-auto md:mx-0 rounded-2xl shadow-2xl"
          />
        </div>

        {/* Text Right */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-bold text-white mb-6 animate__animated animate__fadeIn">
            About Me
          </h1>
          <h3 className="text-2xl font-semibold text-white mb-6">
            Full Stack Software Engineer | Developer | UI/UX Designer
          </h3>
          <p className="text-lg text-[#d9dae2] leading-relaxed mb-6 animate__animated animate__fadeIn animate__delay-1s">
I'm a builder at heart, an engineer who designs with intention and creates with purpose. With a foundation in full stack development, UI/UX design, and visual storytelling, I craft digital experiences that are as functional as they are beautiful. My work lives in code and creativity. I don’t just develop features, I design journeys. From scalable backend architecture to pixel-perfect interfaces, I make sure every layer of a product feels seamless and user-focused. I'm not afraid to take on complex challenges, explore bold ideas, or build from scratch. Whether it's launching full-scale applications, improving user flows, or shaping product direction, I bring both the technical depth and design sensibility to move fast and build smart. I'm always learning, tuning, and evolving, because innovation demands it. If you're looking for someone who can think like a developer, design like an artist, and execute like a founder, I'm ready to bring that vision to life. I'm a builder at heart, an engineer who designs with intention and creates with purpose.
          </p>

          {/* Social Icons & Calendly */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mt-8">
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://github.com/Jessi-777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#23272d] hover:text-[#96b9c6] text-2xl transition"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#23272d] hover:text-[#96b9c6] text-2xl transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://x.com/IamTicaRey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#23272d] hover:text-[#96b9c6] text-2xl transition"
              >
                <FaTwitter />
              </a>
            </div>

            {/* Calendly Button */}
            <a
              href="https://calendly.com/jessisoftwareengineer/meeting-with-jessi-aka-tica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 mt-4 md:mt-0 bg-[#23272d] text-white font-semibold rounded-lg shadow-md hover:bg-[#2b2c31] transition duration-300"
            >
              📅 Schedule a Meeting
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;





// // src/pages/About.jsx
// import React from 'react';

// const About = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-6 text-center">
//         {/* Animated Image */}
//         <div className="mb-8 animate-fade-in">
//           <img
//             src="/tica1.jpg"
//             alt="Tica working"
//             className="w-full max-w-sm mx-auto rounded-2xl shadow-lg"
//           />
//         </div>
        
//         {/* Title */}
//         <h1 className="text-4xl font-bold text-[#173767] mb-4">About Me</h1>

//         {/* Description */}
//         <p className="text-lg text-gray-700 mb-4">
//           I'm a Full Stack Software Engineer passionate about building scalable solutions with a focus on clean design and seamless user experiences.
//         </p>

//         <p className="text-lg text-gray-700">
//           With experience in both front-end and back-end technologies, I work to create solutions that are efficient, user-friendly, and visually appealing. Whether it's crafting engaging UI/UX designs or building robust backend systems, I take pride in the process of turning ideas into fully functional products.
//         </p>
//       </div>
//     </section>
//   );
// };

// export default About;


