import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here (e.g. send to backend or API)
  };

  return (
    <section className="min-h-screen bg-[#6b7396de] py-20 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-white">
          Investor Contact
        </h1>
        <p className="text-lg text-center mb-10 text-gray-200">
          Interested in investing in <span className="font-semibold text-white">Challego LLC Start Up</span>? We'd love to hear from you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="w-full py-3 text-xl font-semibold bg-white text-[#173767] rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Send Message
          </button>
        </form>
        <div className="mt-10 text-center text-sm text-gray-300">
          Or email us directly at <a href="mailto:invest@pawfectplug.com" className="underline hover:text-white">invest@challegoinvest.com</a>
        </div>
        <div className="mt-4 text-center">
          <a
            href="/pitch-deck.pdf"
            className="inline-block mt-4 px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-[#173767] transition-all duration-300"
            target="_blank" rel="noopener noreferrer"
          >
            Download Pitch Deck
          </a>
        </div>

{/* let schedule a meeting be available when the user is connected to tica in message inbox */}
        {/* <a
              href="https://calendly.com/jessisoftwareengineer/meeting-with-jessi-aka-tica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 mt-4 md:mt-0 bg-[#23272d] text-white font-semibold rounded-lg shadow-md hover:bg-[#2b2c31] transition duration-300"
            >
              📅 Schedule a Meeting
            </a> */}
        
      </div>
    </section>
  );
};

export default Contact;



