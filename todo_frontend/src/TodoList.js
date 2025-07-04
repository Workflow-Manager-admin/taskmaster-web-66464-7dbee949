import React, { useState } from "react";

// PUBLIC_INTERFACE
// A single todo item row, supporting toggle, edit, and delete.
function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.title);

  // PUBLIC_INTERFACE
  // Handles update/save for editing
  function handleUpdate(e) {
    e.preventDefault();
    if (editVal.trim() && editVal !== todo.title) {
      onEdit(editVal);
    }
    setEditing(false);
  }

  return (
    <li
      style={{
        display: "flex", alignItems: "center", padding: 0, marginBottom: 8,
        background: "var(--bg-secondary)", borderRadius: 8, boxShadow: "0 1px 3px #0001"
      }}
    >
      <button
        style={{
          background: "none", border: "none",
          minWidth: 36, fontSize: 20, color: todo.completed ? "#43a047" : "#bbb",
          cursor: "pointer", marginLeft: 8
        }}
        aria-label="toggle complete"
        onClick={() => onToggle()}
        tabIndex={0}
      >
        {todo.completed ? "✔️" : "○"}
      </button>
      {editing ? (
        <form onSubmit={handleUpdate} style={{ flex: 1 }}>
          <input
            type="text"
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            style={{
              width: "90%", fontSize: 16, padding: "3px 8px", border: "1px solid var(--border-color)",
              borderRadius: 5
            }}
            autoFocus
          />
        </form>
      ) : (
        <span
          style={{
            flex: 1,
            fontSize: 17,
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "#888" : "var(--text-primary)",
            padding: "8px 0 8px 8px",
            cursor: "pointer"
          }}
          onDoubleClick={() => setEditing(true)}
        >
          {todo.title}
        </span>
      )}
      <button
        style={{
          background: "transparent", border: "none",
          color: "#f44336", fontSize: 18, margin: "0 12px", cursor: "pointer"
        }}
        aria-label="Delete task"
        onClick={onDelete}
      >
        🗑
      </button>
      {!editing && (
        <button
          style={{
            background: "none", border: "none",
            color: "#ffc107", fontSize: 17, cursor: "pointer", marginRight: 8
          }}
          onClick={() => setEditing(true)}
          aria-label="Edit task"
        >
          ✏️
        </button>
      )}
    </li>
  );
}

// PUBLIC_INTERFACE
// Full todo list. Expects props.todos array and CRUD functions.
export default function TodoList({
  todos,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
}) {
  if (!todos.length) return <div style={{ color: "#888", fontSize: 16, marginTop: 20 }}>No tasks yet.</div>;
  return (
    <ul style={{
      listStyleType: "none", padding: 0, margin: "18px 0 0 0", maxWidth: 410, width: "100%",
    }}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo)}
          onEdit={val => onEditTodo(todo, val)}
          onDelete={() => onDeleteTodo(todo)}
        />
      ))}
    </ul>
  );
}
