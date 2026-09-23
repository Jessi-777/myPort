import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaPaperPlane, FaCalendar, FaFileAlt, FaDownload, FaLinkedin, FaTwitter, FaGithub, FaCheckCircle,  } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <section 
      className="relative min-h-screen bg-center bg-cover bg-no-repeat py-20 overflow-hidden"
      style={{ backgroundImage: "url('/black.jpg')" }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/95 to-[#2e333a]/90 z-0"></div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-[#96b9c6]/10 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#335099]/10 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 bg-[#96b9c6]/5 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Info */}
          <div className="text-white">
            <div className="inline-block px-4 py-2 bg-[#96b9c6]/20 backdrop-blur-sm rounded-full mb-6 border border-[#96b9c6]/30">
              <span className="text-[#96b9c6] text-sm font-semibold">💬 Let's Connect</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Get in <span className="bg-gradient-to-r from-[#96b9c6] to-[#335099] bg-clip-text text-transparent">Touch</span>
            </h1>

            <p className="text-xl text-[#d9dae2] mb-8 leading-relaxed">
              Interested in investing in <span className="text-[#96b9c6] font-semibold"> Start Ups</span>? 
              Have a project in mind? Let's talk about how we can work together.
            </p>

            {/* Contact Methods */}
            <div className="space-y-4 mb-8">
              <div className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#96b9c6]/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="text-xl text-[#96b9c6]" />
                </div>
                <div>
                  <div className="text-sm text-[#d9dae2]">Email</div>
                  <a href="mailto:jcsoftwareengineer369@gmaial.com" className="text-white font-semibold hover:text-[#96b9c6] transition">
                    jcsoftwareengineer369@gmail.com
                  </a>
                </div>
              </div>

              <div className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#96b9c6]/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaCalendar className="text-xl text-[#96b9c6]" />
                </div>
                <div>
                  <div className="text-sm text-[#d9dae2]">Schedule</div>
                  <a 
                    href="https://calendly.com/jessisoftwareengineer/meeting-with-jessi-aka-tica"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-[#96b9c6] transition"
                  >
                    Book a Meeting
                  </a>
  
                </div>
              </div>

              <div className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#96b9c6]/50 hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 bg-[#335099]/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaFileAlt className="text-xl text-[#96b9c6]" />
                </div>
                <div>
                  <div className="text-sm text-[#d9dae2]">Resume</div>
                  <a
                    href="/Jessica_Chavez_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl  font-semibold transition"
                  >
                    Download Resume
                  </a>
  
                </div>
              </div>



            </div>

            {/* Social Links */}
            <div className="mb-8">
              <p className="text-sm text-[#d9dae2] mb-4">Connect on social</p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Jessi-777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#96b9c6] hover:scale-110 transition-all duration-300"
                >
                  <FaGithub className="text-xl" />
                </a>
                <a
                  href="https://www.linkedin.com/in/jessi-chavez-aka-tica-rey-33270231/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#96b9c6] hover:scale-110 transition-all duration-300"
                >
                  <FaLinkedin className="text-xl" />
                </a>

                <a
                href="https://x.com/IamTicaRey"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#96b9c6] hover:scale-110 transition-all duration-300"
              >
                <FaXTwitter className="text-xl" />
              </a>

              </div>
            </div>

            {/* Download Pitch Deck */}
            {/* <a
              href="/pitch-deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <FaDownload /> Download Pitch Deck
            </a> */}

          </div>

          {/* Right Side - Form */}
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#96b9c6] to-[#335099] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <FaCheckCircle className="text-4xl text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-[#d9dae2]">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#d9dae2] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="text-[#96b9c6]" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#96b9c6] focus:ring-2 focus:ring-[#96b9c6]/20 transition"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#d9dae2] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-[#96b9c6]" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#96b9c6] focus:ring-2 focus:ring-[#96b9c6]/20 transition"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#d9dae2] mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your investment interests or project ideas..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-[#96b9c6] focus:ring-2 focus:ring-[#96b9c6]/20 transition resize-none"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="text-xs text-[#d9dae2] mt-1">
                      {formData.message.length} characters
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#96b9c6] to-[#335099] text-white font-semibold rounded-lg shadow-lg hover:shadow-[#96b9c6]/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;



