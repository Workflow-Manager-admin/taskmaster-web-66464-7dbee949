import React, { useEffect, useState } from 'react';
import './App.css';
import Auth from './Auth';
import { supabase } from './supabaseClient';
import TodoList from './TodoList';
import TodoInput from './TodoInput';

// PUBLIC_INTERFACE
// Main app for todo manager with Supabase CRUD/auth integration.
function App() {
  // Theme management
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // User auth and todos state
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crudError, setCrudError] = useState("");

  // On mount, restore user session
  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthChecked(true);
    }
    getSession();
    // Session listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription?.unsubscribe?.(); };
  }, []);

  // Load todos from Supabase for current user
  useEffect(() => {
    if (!user) { setTodos([]); return; }
    setLoading(true);
    supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })
      .then(({ data, error }) => {
        if (error) setCrudError(error.message || "Can't fetch todos.");
        else setCrudError("");
        setTodos(data || []);
        setLoading(false);
      });
  }, [user]);

  // PUBLIC_INTERFACE
  // Add a new todo for the current user
  async function handleAddTodo(title) {
    if (!title.trim()) return;
    setLoading(true);
    setCrudError("");
    const { error, data } = await supabase
      .from('todos')
      .insert([{ title, completed: false, user_id: user.id }])
      .select();
    if (error) setCrudError(error.message ?? "Can't add todo.");
    else setTodos(todos => [data[0], ...todos]);
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  // Toggle todo complete/incomplete
  async function handleToggleTodo(todo) {
    const { error, data } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)
      .eq('user_id', user.id)
      .select();
    if (error) setCrudError(error.message || "Can't toggle todo.");
    else setTodos(todos => todos.map(t => (t.id === todo.id ? data[0] : t)));
  }

  // PUBLIC_INTERFACE
  // Edit todo title
  async function handleEditTodo(todo, newTitle) {
    if (!newTitle.trim()) return;
    const { error, data } = await supabase
      .from('todos')
      .update({ title: newTitle })
      .eq('id', todo.id)
      .eq('user_id', user.id)
      .select();
    if (error) setCrudError(error.message || "Can't edit todo.");
    else setTodos(todos => todos.map(t => (t.id === todo.id ? data[0] : t)));
  }

  // PUBLIC_INTERFACE
  // Delete todo item
  async function handleDeleteTodo(todo) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id)
      .eq('user_id', user.id);
    if (error) setCrudError(error.message || "Can't delete todo.");
    else setTodos(todos => todos.filter(t => t.id !== todo.id));
  }

  // PUBLIC_INTERFACE
  // Logs user out
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // UI Layout as described: Topbar/nav, centered task input, below is list.
  if (!authChecked) {
    return <div className="App"><div style={{ margin: 60, color: "#555" }}>Loading...</div></div>;
  }
  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Auth onAuth={() => window.location.reload()} />
        </header>
      </div>
    );
  }
  return (
    <div className="App">
      {/* Nav/Toolbar */}
      <nav style={{
        width: "100%", background: "#1976d2", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.7em 0.5em 0.7em 2.2em", boxSizing: "border-box",
        marginBottom: 32, fontWeight: 600, fontSize: 20, letterSpacing: ".5px"
      }}>
        <span role="img" aria-label="todo" style={{ fontSize: 23, marginRight: 15, verticalAlign: "middle" }}>📝</span>
        <span style={{ flex: 1, textAlign: "left" }}>TaskMaster</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontSize: 15, color: "#fff", opacity: 0.8
          }}>
            {user.email}
          </span>
          <button onClick={handleLogout} style={{
            marginLeft: 8, color: "#fff",
            background: "#424242", border: "none",
            borderRadius: 8, padding: "7px 14px",
            fontWeight: 500, letterSpacing: ".4px",
            cursor: "pointer"
          }}>Logout</button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ marginLeft: 8 }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      {/* Task Entry Field */}
      <div style={{ maxWidth: 420, margin: "0 auto 20px auto" }}>
        <TodoInput onAdd={handleAddTodo} />
      </div>
      {crudError && (
        <div style={{
          color: "#d32f2f", background: "#fff0f1", padding: "7px 15px",
          borderRadius: 9, maxWidth: 420, margin: "6px auto"
        }}>
          {crudError}
        </div>
      )}
      {/* Todos List */}
      <div style={{ maxWidth: 430, margin: "0 auto 0 auto", marginBottom: 36 }}>
        {loading
          ? <div style={{ color: "#888", margin: 20, fontSize: 15 }}>Loading tasks...</div>
          : <TodoList
              todos={todos}
              onToggleTodo={handleToggleTodo}
              onEditTodo={handleEditTodo}
              onDeleteTodo={handleDeleteTodo}
            />
        }
      </div>
      {/* Footer */}
      <footer style={{ textAlign: "center", fontSize: 15, color: "#999", marginTop: 24, marginBottom: 18 }}>
        <span>Minimal Todo App &mdash; Powered by Supabase & React</span>
      </footer>
    </div>
  );
}

export default App;
