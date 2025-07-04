import React, { useState } from "react";

// PUBLIC_INTERFACE
// Input field and button for adding a new task.
export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  // Handles add todo
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim());
    setTitle("");
    setLoading(false);
  }
  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex", alignItems: "center", width: "100%", maxWidth: 410, margin: "0 auto"
    }}>
      <input
        type="text"
        required
        autoFocus
        aria-label="Add new task"
        placeholder="Add a new task..."
        value={title}
        style={{
          flex: 1,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: "0.7em 1em",
          fontSize: 17,
          marginRight: 7,
          outline: "none"
        }}
        onChange={e => setTitle(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        style={{
          background: "#1976d2", color: "#fff", border: "none",
          borderRadius: 8, padding: "0.7em 1.3em", fontWeight: 600, cursor: "pointer",
          fontSize: 16, transition: "background 0.2s"
        }}
        disabled={loading}
      >
        {loading ? "..." : "Add"}
      </button>
    </form>
  );
}
