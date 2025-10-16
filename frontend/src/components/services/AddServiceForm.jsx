import React, { useState } from "react";
import api from "../../services/api";

export default function AddServiceForm({ onClose, onServiceAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/services", { title, description });
      onServiceAdded(response.data); // Notify parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add service", error);
      alert("Error: Could not add service.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-300"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-300"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
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
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
        >
          Add Service
        </button>
      </div>
    </form>
  );
}
