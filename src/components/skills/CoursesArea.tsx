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

  if (loading) return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="container mx-auto py-24 text-center text-xl text-purple-500">Loading...</div>
    </section>
  );
  if (categories.length === 0) return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="container mx-auto py-24 text-center text-xl text-purple-200">No categories found.</div>
    </section>
  );

  // Separate the "Other" category from the rest
  const normalCategories = categories.filter(c => c.category !== 'Other');

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Gradient background and shapes absolutely positioned to section */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#2d0b4e] via-[#1a1333] to-[#3a1c71] absolute inset-0" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-purple-700 opacity-40 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-600 opacity-30 rounded-full animate-pulse-fast"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-white opacity-10 rounded-full animate-fade-in"></div>
          <div className="absolute top-10 left-1/4 w-40 h-40 bg-pink-400 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-24 left-1/3 w-32 h-32 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 right-10 w-28 h-28 bg-green-400 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/4 left-2/3 w-36 h-36 bg-purple-300 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/2 left-10 w-20 h-20 bg-fuchsia-400 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-orange-300 opacity-20 rounded-full blur-2xl"></div>
        </div>
      </div>
      {/* Content area */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-16 pb-24">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
            {normalCategories.map(({ category, skills }) => {
              const isOpen = openCategories[category] ?? false;

              return (
                <div key={category} className="w-full rounded-2xl shadow-xl border border-purple-100 bg-white/80 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl mb-2">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex justify-between items-center px-7 py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white text-xl font-semibold rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-purple-700 transition"
                    aria-expanded={isOpen}
                    aria-controls={`${category}-skills`}
                  >
                    <span>{category}</span>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-y-auto`}
                    style={{ maxHeight: isOpen ? "24rem" : "0" }} // enables scrolling for long lists
                  >
                    <ul className="divide-y divide-gray-100">
                      {skills.map(skill => (
                        <li
                          key={skill.id}
                          className="px-7 py-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 cursor-pointer text-purple-900 font-medium"
                        >
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}

            {/* Show "Other" in the same dropdown style as the rest */}
            <div className="w-full rounded-2xl shadow-xl border-2 border-purple-700 bg-gradient-to-br from-purple-200 via-white to-purple-100 mt-2 transition-all duration-300 hover:shadow-2xl mb-2">
              <button
                onClick={() => toggleCategory("Other")}
                className="w-full flex justify-between items-center px-7 py-5 bg-gradient-to-r from-purple-900 to-purple-700 text-white text-xl font-semibold rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-purple-700 transition"
                aria-expanded={openCategories["Other"] ?? false}
                aria-controls={`other-category-skills`}
              >
                <span>Other</span>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    openCategories["Other"] ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ${
                  openCategories["Other"] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <ul className="divide-y divide-gray-100 bg-white/90 rounded-b-2xl">
                  {otherSkills.length === 0 ? (
                    <li className="px-7 py-3 text-purple-300">No skills found.</li>
                  ) : (
                    otherSkills.map((skill) => (
                      <li
                        key={skill.id}
                        className="px-7 py-3 border-b border-gray-100 last:border-b-0 hover:bg-purple-50 cursor-pointer text-purple-900 font-medium"
                      >
                        {skill.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* Custom animations */}
          <style jsx global>{`
            @keyframes pulse-slow {
              0%, 100% { opacity: 0.4; transform: scale(1);}
              50% { opacity: 0.6; transform: scale(1.08);}
            }
            @keyframes pulse-fast {
              0%, 100% { opacity: 0.3; transform: scale(1);}
              50% { opacity: 0.5; transform: scale(1.12);}
            }
            @keyframes fade-in {
              0% { opacity: 0; }
              100% { opacity: 0.10; }
            }
            .animate-pulse-slow {
              animation: pulse-slow 6s ease-in-out infinite;
            }
            .animate-pulse-fast {
              animation: pulse-fast 3.5s ease-in-out infinite;
            }
            .animate-fade-in {
              animation: fade-in 2s ease-in;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default CourseArea;