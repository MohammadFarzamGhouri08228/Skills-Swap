'use client';

import React, { useEffect, useState } from 'react';
import { fetchSkills } from '../../lib/fetchskills';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Skill = {
  id: string;
  name: string;
};

type CategoryWithSkills = {
  category: string;
  skills: Skill[];
};

const SKILLS_PARENT_ID = "8R9ZJJBnFqJeAUvaQdqr";
const OTHER_DOC_ID = "dvNqmLonyUWYkLJCGxUx";

const CourseArea: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [otherSkills, setOtherSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      const skills = await fetchSkills();

      // Fetch "Other" skills from Firestore subcollection by fixed id
      let fetchedOtherSkills: Skill[] = [];
      if (db) {
        const otherDocRef = doc(
          db,
          "skills",
          SKILLS_PARENT_ID,
          "Other",
          OTHER_DOC_ID
        );
        const otherDocSnap = await getDoc(otherDocRef);
        if (otherDocSnap.exists()) {
          const arr = otherDocSnap.data()["Skill Name"] || [];
          fetchedOtherSkills = arr.map((s: string, idx: number) => ({
            id: idx.toString(),
            name: s,
          }));
        }
      }

      setOtherSkills(fetchedOtherSkills);
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
  const normalCategories = categories.filter(c => c.category !== 'Other');

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

      {/* Show "Other" in the same dropdown style as the rest */}
      <div className="border border-gray-300 rounded shadow-sm">
        <button
          onClick={() => toggleCategory("Other")}
          className="w-full flex justify-between items-center bg-purple-800 text-white text-lg font-semibold px-5 py-3 rounded-t hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
          aria-expanded={openCategories["Other"] ?? false}
          aria-controls={`other-category-skills`}
        >
          Other
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${
              openCategories["Other"] ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        {openCategories["Other"] && (
          <ul
            id={`other-category-skills`}
            className="bg-white border-t border-gray-300 rounded-b max-h-60 overflow-y-auto"
          >
            {otherSkills.length === 0 ? (
              <li className="px-6 py-3 text-purple-300">No skills found.</li>
            ) : (
              otherSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 cursor-pointer"
                >
                  {skill.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseArea;