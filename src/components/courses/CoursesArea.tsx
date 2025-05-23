'use client';

import React, { useEffect, useState } from 'react';
import { fetchSkills } from '../../lib/fetchskills';

type Skill = {
  id: string;
  name: string;
};

type CategoryWithSkills = {
  category: string;
  skills: Skill[];
};

const CourseArea: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [otherSearch, setOtherSearch] = useState('');

  useEffect(() => {
    const loadSkills = async () => {
      const skills = await fetchSkills();
      setCategories(skills);
      setLoading(false);
    };

    loadSkills();
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (categories.length === 0) return <div className="p-4">No categories found.</div>;

  // Separate the "Other" category from the rest
  const otherCategory = categories.find(c => c.category === 'Other');
  const normalCategories = categories.filter(c => c.category !== 'Other');

  // Filter skills inside Other based on search input
  const filteredOtherSkills = otherCategory?.skills.filter(skill =>
    skill.name.toLowerCase().includes(otherSearch.toLowerCase())
  ) || [];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {normalCategories.map(({ category, skills }) => {
        const isOpen = openCategories[category] ?? false;

        return (
          <div key={category} className="border border-gray-300 rounded shadow-sm">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex justify-between items-center bg-purple-800 text-white text-lg font-semibold px-5 py-3 rounded-t hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
              aria-expanded={isOpen}
              aria-controls={`${category}-skills`}
            >
              {category}
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {isOpen && (
              <ul
                id={`${category}-skills`}
                className="bg-white border-t border-gray-300 rounded-b max-h-60 overflow-y-auto"
              >
                {skills.map(skill => (
                  <li
                    key={skill.id}
                    className="px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 cursor-pointer"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* Other category shown separately with search */}
      {otherCategory && (
        <div className="mt-10 p-4 border border-purple-900 rounded shadow-sm bg-purple-800">
          <h2 className="text-xl font-semibold text-white mb-3">Other Skills</h2>
          <input
            type="text"
            placeholder="Search other skills..."
            value={otherSearch}
            onChange={e => setOtherSearch(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-700 text-gray-900"
          />
          {filteredOtherSkills.length === 0 ? (
            <p className="text-purple-300">No skills found.</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {filteredOtherSkills.map(skill => (
                <li
                  key={skill.id}
                  className="px-4 py-2 border-b border-purple-700 last:border-b-0 cursor-pointer hover:bg-purple-700 hover:text-white rounded"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseArea;
