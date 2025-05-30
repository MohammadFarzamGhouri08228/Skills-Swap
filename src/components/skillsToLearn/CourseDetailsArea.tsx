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
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryWithSkills[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [otherSkill, setOtherSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [addingSkillName, setAddingSkillName] = useState<string>("");
  const [removingSkillName, setRemovingSkillName] = useState<string>("");
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [addingOtherSkill, setAddingOtherSkill] = useState(false);

  // Get current user and their skillsWanted from Firestore
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
          await setDoc(userRef, { skillsWanted: [] }, { merge: true });
          setSkillsWanted([]);
        } else {
          const data = userSnap.data();
          if (!Array.isArray(data.skillsWanted)) {
            await updateDoc(userRef, { skillsWanted: [] });
            setSkillsWanted([]);
          } else {
            setSkillsWanted(data.skillsWanted);
          }
        }
      } else {
        setUser(null);
        setSkillsWanted([]);
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
    if (!user || !skillName.trim() || skillsWanted.includes(skillName.trim())) return;
    setAddingSkill(true);
    setAddingSkillName(skillName);
    try {
      const userRef = doc(db!, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { skillsWanted: [skillName.trim()] }, { merge: true });
        setSkillsWanted([skillName.trim()]);
      } else {
        const data = userSnap.data();
        if (!Array.isArray(data.skillsWanted)) {
          await updateDoc(userRef, { skillsWanted: [skillName.trim()] });
          setSkillsWanted([skillName.trim()]);
        } else {
          await updateDoc(userRef, {
            skillsWanted: arrayUnion(skillName.trim()),
          });
          setSkillsWanted((prev) =>
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
      skillsWanted: arrayRemove(skillName.trim()),
    });
    setSkillsWanted((prev) => prev.filter((skill) => skill !== skillName.trim()));
    setAddingSkill(false);
    setRemovingSkillName("");
  };

  // Add a new skill to "Other" category and user's skillsWanted (add to Skill Name array in Other subcollection doc)
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

      // Add to user's skillsWanted
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
    <section className="courses section-padding">
      <div className="container">
        {/* Add Skills Heading */}
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-900 tracking-wide drop-shadow">
          <span className="inline-block border-b-4 border-purple-500 pb-1 px-4 bg-white rounded shadow">
            Add Skills
          </span>
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {skillsLoading ? (
            <div className="text-center text-purple-700 py-8">
              Loading skill categories...
            </div>
          ) : (
            <>
              {normalCategories.map(({ category, skills: catSkills }) => {
                const isOpen = openCategories[category] ?? false;
                // Ensure all skills are Skill objects
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
                    className="border border-gray-300 rounded shadow-sm"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex justify-between items-center bg-purple-800 text-white text-lg font-semibold px-5 py-3 rounded-t hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
                      aria-expanded={isOpen}
                      aria-controls={`${category}-skills`}
                    >
                      {category}
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
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
                    {isOpen && (
                      <ul
                        id={`${category}-skills`}
                        className="bg-white border-t border-gray-300 rounded-b max-h-60 overflow-y-auto"
                      >
                        {skillsArray.map((skill) => (
                          <li
                            key={skill.id}
                            className={`px-6 py-3 border-b border-gray-100 last:border-b-0 flex justify-between items-center ${
                              skillsWanted.includes(skill.name)
                                ? "bg-purple-100 text-purple-700"
                                : "hover:bg-purple-50"
                            }`}
                          >
                            <span>{skill.name}</span>
                            {skillsWanted.includes(skill.name) ? (
                              <button
                                className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded hover:bg-red-400"
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
                                className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded hover:bg-purple-400"
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
                    )}
                  </div>
                );
              })}

              {/* Other category dropdown styled like the rest */}
              {otherCategory && (
                <div className="border border-gray-300 rounded shadow-sm mt-10">
                  <button
                    onClick={() => toggleCategory(otherCategory.category!)}
                    className="w-full flex justify-between items-center bg-purple-800 text-white text-lg font-semibold px-5 py-3 rounded-t hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700"
                    aria-expanded={openCategories[otherCategory.category!] ?? false}
                    aria-controls={`other-category-skills`}
                  >
                    {otherCategory.category}
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ${
                        openCategories[otherCategory.category!] ? "rotate-180" : "rotate-0"
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
                  {openCategories[otherCategory.category!] && (
                    <div className="bg-white border-t border-gray-300 rounded-b">
                      {otherSkillsArray.length === 0 ? (
                        <p className="text-purple-300 px-6 py-3">No skills found.</p>
                      ) : (
                        <ul className="max-h-60 overflow-y-auto">
                          {otherSkillsArray.map((skill) => (
                            <li
                              key={skill.id}
                              className="flex items-center justify-between gap-2 mb-2 px-4 py-2 rounded-lg shadow-sm bg-white text-black border border-gray-200 hover:shadow-md transition-all"
                            >
                              <span className="font-medium">{skill.name}</span>
                              {skillsWanted.includes(skill.name) ? (
                                <button
                                  className="ml-2 text-xs bg-red-200 text-red-800 px-3 py-1 rounded-full hover:bg-red-400 transition"
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
                                  className="ml-2 text-xs bg-purple-300 text-purple-900 px-3 py-1 rounded-full hover:bg-purple-400 transition"
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
                      <form onSubmit={handleAddOtherSkill} className="flex gap-2 mt-4 px-4 pb-4">
                        <input
                          type="text"
                          value={otherSkill}
                          onChange={(e) => setOtherSkill(e.target.value)}
                          placeholder="Add a new skill to Other"
                          className="flex-1 px-4 py-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-700 text-gray-900"
                        />
                        <button
                          type="submit"
                          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 transition"
                          disabled={addingOtherSkill || !otherSkill.trim()}
                        >
                          {addingOtherSkill ? "Adding..." : "Add"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Show user's current skillsWanted */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-900 tracking-wide drop-shadow">
              <span className="inline-block border-b-4 border-purple-500 pb-1 px-4 bg-white rounded shadow">
                Skills I Want to Learn
              </span>
            </h3>
            {skillsWanted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg
                  className="w-12 h-12 text-purple-300 mb-2"
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
                <p className="text-lg text-purple-400">No skills added yet.</p>
              </div>
            ) : (
              <ul className="flex flex-wrap justify-center gap-3">
                {skillsWanted.map((skill, idx) => (
                  <li
                    key={idx}
                    className="flex items-center bg-purple-100 text-purple-900 px-4 py-2 rounded-full shadow hover:bg-purple-200 transition-all text-base font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      className="ml-3 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full hover:bg-red-400 transition"
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
        </div>
      </div>
    </section>
  );
}