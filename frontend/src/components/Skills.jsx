import React from 'react';

const skillsList = [
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'Express',
  'Tailwind CSS',
  'Git',
  'REST APIs'
];

const Skills = () => {
  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Skills</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skillsList.map((skill, index) => (
            <li
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-center font-medium text-gray-700"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Skills;
