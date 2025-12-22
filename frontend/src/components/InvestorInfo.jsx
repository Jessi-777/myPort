import React from 'react';

const InvestorInfo = () => {
  return (
    <div className="min-h-screen bg-[#1f2227] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Investor Information</h1>

        {/* Background Image */}
        <div
          className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center rounded-xl overflow-hidden"
          style={{
            backgroundImage: "url('/phone.png')",
          }}
        ></div>

        {/* About Investment Opportunities */}
        <section className="mb-12 mt-12">
          <h2 className="text-2xl font-semibold mb-2">Explore Investment Opportunities</h2>
          <p className="text-gray-300">
            We are offering unique opportunities to invest in three innovative businesses that are set to make a significant impact. These businesses span across e-commerce, agriculture, and pet care industries, providing diverse options for investors looking to diversify their portfolio.
          </p>
        </section>

        {/* 3 Investment Opportunities */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Challego Online Market */}
          <div className="bg-white shadow rounded-2xl p-6 border text-black">
            <h3 className="font-semibold text-lg mb-2">Challego Online Market</h3>
            <p className="text-gray-600">
              Challego is a growing online marketplace that connects local artisans and small businesses with a wider audience. With an innovative platform and a focus on supporting local economies, Challego aims to disrupt the traditional e-commerce model.
            </p>
            <p className="text-gray-400 mt-4">Investment Goal: $500,000</p>
          </div>

          {/* Farm App */}
          <div className="bg-white shadow rounded-2xl p-6 border text-black">
            <h3 className="font-semibold text-lg mb-2">Farm App</h3>
            <p className="text-gray-600">
              Farm App is designed to empower local communities & farmers with the tools they need to grow their crops efficiently. By connecting farmers with technology like plant disease detection, water management, and community support, Farm App has the potential to revolutionize agriculture in local communities.
            </p>
            <p className="text-gray-400 mt-4">Investment Goal: $350,000</p>
          </div>

          {/* PawfectPlug */}
          <div className="bg-white shadow rounded-2xl p-6 border text-black">
            <h3 className="font-semibold text-lg mb-2">Pawfect Plug</h3>
            <p className="text-gray-600">
              Pawfect Plug is a platform revolutionizing pet care by offering personalized subscription services that include eco-friendly products, food, and healthcare for pets. We aim to build an integrated system that connects pet owners with local stores while providing data-driven product recommendations.
            </p>
            <p className="text-gray-400 mt-4">Investment Goal: $150,000</p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-2">Interested in Investing?</h2>
          <p className="text-gray-300 mb-4">
            If any of these investment opportunities resonate with you, let’s connect. Schedule a call or request a pitch deck for more detailed information.
          </p>
          <a
            href="mailto:founder@pawfectplug.com"
            className="inline-block bg-[#161a22] hover:bg-[#383e48] text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Contact Tica
          </a>
        </section>
      </div>
    </div>
  );
};

export default InvestorInfo;

