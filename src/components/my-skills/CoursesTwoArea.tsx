"use client";
import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchSkills } from "@/lib/fetchskills";

type Skill = {
  id: string;
  name: string;
};

type CategoryWithSkills = {
  id?: string;
  category: string;
  skills: Skill[] | string[];
};

const SKILLS_PARENT_ID = "8R9ZJJBnFqJeAUvaQdqr";
const OTHER_DOC_ID = "dvNqmLonyUWYkLJCGxUx";

export default function MySkillsArea() {
  const [user, setUser] = useState<any>(null);
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryWithSkills[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [otherSkill, setOtherSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [addingSkillName, setAddingSkillName] = useState<string>("");
  const [removingSkillName, setRemovingSkillName] = useState<string>("");
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [addingOtherSkill, setAddingOtherSkill] = useState(false);

  // Get current user and their skillsOffered
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (!db) return;
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, { skillsOffered: [] }, { merge: true });
          setSkillsOffered([]);
        } else {
          const data = userSnap.data();
          if (!Array.isArray(data.skillsOffered)) {
            await updateDoc(userRef, { skillsOffered: [] });
            setSkillsOffered([]);
          } else {
            setSkillsOffered(data.skillsOffered);
          }
        }
      } else {
        setUser(null);
        setSkillsOffered([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch skill categories and skills, and always patch "Other" from subcollection
  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);
      const skillsData = await fetchSkills();

      // Fetch "Other" skills from subcollection
      const otherDocRef = doc(
        db!,
        "skills",
        SKILLS_PARENT_ID,
        "Other",
        OTHER_DOC_ID
      );
      const otherDocSnap = await getDoc(otherDocRef);
      let otherSkills: Skill[] = [];
      if (otherDocSnap.exists()) {
        const otherData = otherDocSnap.data();
        const arr = otherData["Skill Name"] || [];
        otherSkills = arr.map((s: string, idx: number) => ({
          id: idx.toString(),
          name: s,
        }));
      }

      // Patch categories: always replace/add "Other" with the above
      let foundOther = false;
      const patchedCategories = skillsData.map((cat) => {
        if (cat.category === "Other") {
          foundOther = true;
          return {
            ...cat,
            id: OTHER_DOC_ID,
            skills: otherSkills,
          };
        }
        return cat;
      });
      if (!foundOther) {
        patchedCategories.push({
          id: OTHER_DOC_ID,
          category: "Other",
          skills: otherSkills,
        });
      }
      setCategories(patchedCategories);

      // Keep all categories closed by default
      const openState: Record<string, boolean> = {};
      patchedCategories.forEach((cat) => {
        openState[cat.category] = false;
      });
      setOpenCategories(openState);
      setSkillsLoading(false);
    };
    loadSkills();
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAddSkill = async (skillName: string) => {
    if (!user || !skillName.trim() || skillsOffered.includes(skillName.trim())) return;
    setAddingSkill(true);
    setAddingSkillName(skillName);
    try {
      const userRef = doc(db!, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { skillsOffered: [skillName.trim()] }, { merge: true });
        setSkillsOffered([skillName.trim()]);
      } else {
        const data = userSnap.data();
        if (!Array.isArray(data.skillsOffered)) {
          await updateDoc(userRef, { skillsOffered: [skillName.trim()] });
          setSkillsOffered([skillName.trim()]);
        } else {
          await updateDoc(userRef, {
            skillsOffered: arrayUnion(skillName.trim()),
          });
          setSkillsOffered((prev) =>
            prev.includes(skillName.trim()) ? prev : [...prev, skillName.trim()]
          );
        }
      }
    } catch (err) {
      alert("Error adding skill: " + (err as Error).message);
      console.error(err);
    }
    setAddingSkill(false);
    setAddingSkillName("");
  };

  const handleRemoveSkill = async (skillName: string) => {
    if (!user || !skillName.trim()) return;
    setAddingSkill(true);
    setRemovingSkillName(skillName);
    const userRef = doc(db!, "users", user.uid);
    await updateDoc(userRef, {
      skillsOffered: arrayRemove(skillName.trim()),
    });
    setSkillsOffered((prev) => prev.filter((skill) => skill !== skillName.trim()));
    setAddingSkill(false);
    setRemovingSkillName("");
  };

  // Add a new skill to "Other" category and user's skillsOffered (add to Skill Name array in Other subcollection doc)
  const handleAddOtherSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !otherSkill.trim()) return;
    setAddingOtherSkill(true);
    setAddingSkillName(otherSkill.trim());
    try {
      const otherDocRef = doc(
        db!,
        "skills",
        SKILLS_PARENT_ID,
        "Other",
        OTHER_DOC_ID
      );
      const otherDocSnap = await getDoc(otherDocRef);
      if (!otherDocSnap.exists()) {
        // Create the document if it doesn't exist
        await setDoc(otherDocRef, {
          "Skill Name": [otherSkill.trim()],
        });
      } else {
        // Update the existing document
        await updateDoc(otherDocRef, {
          "Skill Name": arrayUnion(otherSkill.trim()),
        });
      }
      // Re-fetch categories to update UI
      const skillsData = await fetchSkills();
      const refreshedOtherDocSnap = await getDoc(otherDocRef);
      let otherSkills: Skill[] = [];
      if (refreshedOtherDocSnap.exists()) {
        const otherData = refreshedOtherDocSnap.data();
        const arr = otherData["Skill Name"] || [];
        otherSkills = arr.map((s: string, idx: number) => ({
          id: idx.toString(),
          name: s,
        }));
      }
      let foundOther = false;
      const patchedCategories = skillsData.map((cat) => {
        if (cat.category === "Other") {
          foundOther = true;
          return {
            ...cat,
            id: OTHER_DOC_ID,
            skills: otherSkills,
          };
        }
        return cat;
      });
      if (!foundOther) {
        patchedCategories.push({
          id: OTHER_DOC_ID,
          category: "Other",
          skills: otherSkills,
        });
      }
      setCategories(patchedCategories);

      // Add to user's skillsOffered
      await handleAddSkill(otherSkill.trim());
      setOtherSkill("");
    } catch (err) {
      alert("Error adding skill: " + (err as Error).message);
      console.error(err);
    }
    setAddingOtherSkill(false);
    setAddingSkillName("");
  };

  if (loading) {
    return (
      <section className="courses section-padding">
        <div className="container">
          <p>Loading user information...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="courses section-padding">
        <div className="container">
          <p className="text-center">Please log in to manage your skills.</p>
        </div>
      </section>
    );
  }

  // Separate the "Other" category from the rest
  const otherCategory = categories.find((c) => c.category === "Other");
  const normalCategories = categories.filter((c) => c.category !== "Other");

  // Map "Other" skills array to objects if needed
  const otherSkillsArray: Skill[] =
    otherCategory && Array.isArray(otherCategory.skills)
      ? (otherCategory.skills as any[]).map((skill, idx) => {
          if (typeof skill === "string") {
            return { id: idx.toString(), name: skill };
          }
          if (skill && typeof skill.name === "string") {
            return skill;
          }
          return { id: idx.toString(), name: "" };
        })
      : [];

    return (
  <section className="relative min-h-screen w-full overflow-x-hidden">

    {/* Aesthetic background as a normal block, not absolute, so no double scrollbars */}
    <div className="w-full bg-gradient-to-br from-[#2d0b4e] via-[#1a1333] to-[#3a1c71]">
      {/* Decorative shapes */}
      <div className="relative w-full h-0" style={{ minHeight: 0 }}>
        <div className="pointer-events-none absolute inset-0 z-0">
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
      <div className="relative z-10 container mx-auto px-4 pt-12">
        {/* Add Skills Heading */}
        <h2 className="text-3xl font-extrabold mb-12 text-center text-white tracking-wide drop-shadow-lg">
          <span className="inline-block border-b-4 border-purple-400 pb-2 px-8 bg-white/10 rounded-xl shadow-lg backdrop-blur">
            Add Skills
          </span>
        </h2>
        {/* Make skill menus vertical and centered */}
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          {skillsLoading ? (
            <div className="text-center text-purple-200 py-8 text-xl font-semibold">
              Loading skill categories...
            </div>
          ) : (
            <>
              {normalCategories.map(({ category, skills: catSkills }) => {
                const isOpen = openCategories[category] ?? false;
                const skillsArray: Skill[] = Array.isArray(catSkills)
                  ? (catSkills as any[]).map((skill, idx) =>
                      typeof skill === "string"
                        ? { id: idx.toString(), name: skill }
                        : skill
                    )
                  : [];
                return (
                  <div
                    key={category}
                    className="w-full rounded-2xl shadow-xl border border-purple-100 bg-white/80 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl mb-2"
                  >
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
                      style={{ maxHeight: isOpen ? "24rem" : "0" }} // 24rem = 384px, adjust as needed
                    >
                      <ul className="divide-y divide-gray-100">
                        {skillsArray.map((skill) => (
                          <li
                            key={skill.id}
                            className={`flex justify-between items-center px-7 py-3 ${
                              skillsOffered.includes(skill.name)
                                ? "bg-purple-50 text-purple-800"
                                : "hover:bg-purple-100"
                            }`}
                          >
                            <span>{skill.name}</span>
                            {skillsOffered.includes(skill.name) ? (
                              <button
                                className="ml-2 text-xs bg-red-200 text-red-800 px-4 py-1 rounded-full hover:bg-red-400 transition font-semibold"
                                onClick={() => handleRemoveSkill(skill.name)}
                                type="button"
                                disabled={addingSkill && removingSkillName === skill.name}
                              >
                                {addingSkill && removingSkillName === skill.name
                                  ? "Removing..."
                                  : "Remove"}
                              </button>
                            ) : (
                              <button
                                className="ml-2 text-xs bg-purple-200 text-purple-800 px-4 py-1 rounded-full hover:bg-purple-400 transition font-semibold"
                                onClick={() => handleAddSkill(skill.name)}
                                type="button"
                                disabled={addingSkill && addingSkillName === skill.name}
                              >
                                {addingSkill && addingSkillName === skill.name
                                  ? "Adding..."
                                  : "Add"}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}

              {/* Other category, visually distinct */}
              {otherCategory && (
                <div className="w-full rounded-2xl shadow-xl border-2 border-purple-700 bg-gradient-to-br from-purple-200 via-white to-purple-100 mt-2 transition-all duration-300 hover:shadow-2xl mb-2">
                  <button
                    onClick={() => toggleCategory(otherCategory.category!)}
                    className="w-full flex justify-between items-center px-7 py-5 bg-gradient-to-r from-purple-900 to-purple-700 text-white text-xl font-semibold rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-purple-700 transition"
                    aria-expanded={openCategories[otherCategory.category!] ?? false}
                    aria-controls={`other-category-skills`}
                  >
                    <span>{otherCategory.category}</span>
                    <svg
                      className={`w-6 h-6 transform transition-transform duration-300 ${
                        openCategories[otherCategory.category!] ? "rotate-180" : "rotate-0"
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
                      openCategories[otherCategory.category!] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="bg-white/90 rounded-b-2xl px-7 py-5">
                      {otherSkillsArray.length === 0 ? (
                        <p className="text-purple-300">No skills found.</p>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {otherSkillsArray.map((skill) => (
                            <li
                              key={skill.id}
                              className="flex items-center justify-between py-2"
                            >
                              <span className="font-medium">{skill.name}</span>
                              {skillsOffered.includes(skill.name) ? (
                                <button
                                  className="ml-2 text-xs bg-red-200 text-red-800 px-4 py-1 rounded-full hover:bg-red-400 transition font-semibold"
                                  onClick={() => handleRemoveSkill(skill.name)}
                                  type="button"
                                  disabled={addingSkill && removingSkillName === skill.name}
                                >
                                  {addingSkill && removingSkillName === skill.name
                                    ? "Removing..."
                                    : "Remove"}
                                </button>
                              ) : (
                                <button
                                  className="ml-2 text-xs bg-purple-200 text-purple-800 px-4 py-1 rounded-full hover:bg-purple-400 transition font-semibold"
                                  onClick={() => handleAddSkill(skill.name)}
                                  type="button"
                                  disabled={
                                    (addingSkill && addingSkillName === skill.name) ||
                                    (addingOtherSkill && addingSkillName === skill.name)
                                  }
                                >
                                  {(addingSkill && addingSkillName === skill.name) ||
                                  (addingOtherSkill && addingSkillName === skill.name)
                                    ? "Adding..."
                                    : "Add"}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <form onSubmit={handleAddOtherSkill} className="flex gap-2 mt-4">
                        <input
                          type="text"
                          value={otherSkill}
                          onChange={(e) => setOtherSkill(e.target.value)}
                          placeholder="Add a new skill to Other"
                          className="flex-1 px-4 py-2 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-700 text-gray-900 bg-white/80 shadow"
                        />
                        <button
                          type="submit"
                          className="bg-purple-700 text-white px-6 py-2 rounded-xl hover:bg-purple-900 transition font-semibold shadow"
                          disabled={addingOtherSkill || !otherSkill.trim()}
                        >
                          {addingOtherSkill ? "Adding..." : "Add"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* My Skills Section */}
        <div className="mt-20 mb-24">
          <h3 className="text-2xl font-bold mb-8 text-center text-purple-900 tracking-wide drop-shadow-lg">
            <span className="inline-block border-b-4 border-purple-500 pb-2 px-8 bg-white/80 rounded-xl shadow-lg">
              My Skills
            </span>
          </h3>
          {skillsOffered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-14 h-14 text-purple-300 mb-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2"
                />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p className="text-xl text-purple-400">No skills added yet.</p>
            </div>
          ) : (
            <ul className="flex flex-wrap justify-center gap-4 bg-white/70 rounded-2xl shadow-lg p-8 backdrop-blur">
              {skillsOffered.map((skill, idx) => (
                <li
                  key={idx}
                  className="flex items-center bg-gradient-to-r from-purple-200 to-purple-100 text-purple-900 px-6 py-2 rounded-full shadow hover:bg-purple-200 transition-all text-lg font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    className="ml-4 text-xl bg-red-200 text-red-800 px-3 py-0.5 rounded-full hover:bg-red-400 transition"
                    onClick={() => handleRemoveSkill(skill)}
                    type="button"
                    disabled={addingSkill && removingSkillName === skill}
                    aria-label={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Add space before footer */}
        <div className="h-16" />
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
}