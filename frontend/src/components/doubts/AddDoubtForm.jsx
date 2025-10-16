import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function AddDoubtForm({ onClose, onDoubtAdded }) {
  const [question, setQuestion] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch faculty list from backend on component mount
  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/faculty");
        setFacultyList(response.data);
        if (response.data.length > 0) {
          setFacultyId(response.data[0].faculty_id);
        }
      } catch (error) {
        console.error("Failed to fetch faculty list", error);
        alert("Error: Could not fetch faculty list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacultyList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !facultyId) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      const response = await api.post("/doubts", { question, facultyId });
      onDoubtAdded(response.data); // Notify parent to refresh list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to submit doubt", error);
      alert("Error: Could not submit your doubt.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-zinc-300"
        >
          Your Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          rows={4}
          placeholder="What is the difference between..."
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>
      <div>
        <label
          htmlFor="faculty"
          className="block text-sm font-medium text-zinc-300"
        >
          Ask a specific faculty member
        </label>
        <select
          id="faculty"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          disabled={isLoading}
          className="mt-1 h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          {isLoading ? (
            <option value="">Loading faculty...</option>
          ) : facultyList.length === 0 ? (
            <option value="">No faculty available</option>
          ) : (
            facultyList.map((faculty) => (
              <option key={faculty.faculty_id} value={faculty.faculty_id}>
                {faculty.name}
              </option>
            ))
          )}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
        >
          Submit Doubt
        </button>
      </div>
    </form>
  );
}
