import React, { useState } from "react";
import { supabase } from "./supabaseClient";

// PUBLIC_INTERFACE
// Authentication component for sign-up/in/out using Supabase.
export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  // Handles sign-in or sign-up using Supabase Auth
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result;
      if (mode === "signin") {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }
      if (result.error) setError(result.error.message);
      else if (result.data?.user || result.data?.session) onAuth(result.data);
      else setError("Check your email for further instructions.");
    } catch (e) {
      setError("Authentication error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 330, margin: "8vh auto", padding: 24, background: "var(--bg-secondary)",
      borderRadius: 12, boxShadow: "0 2px 8px #0002"
    }}>
      <h2 style={{ marginBottom: 14 }}>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email" required autoComplete="username"
          value={email}
          placeholder="Email"
          style={inputStyle}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password" required autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          placeholder="Password"
          style={inputStyle}
          minLength={6}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div style={{ color: "#b71c1c", margin: "8px 0", fontSize: 14 }}>{error}</div>}
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        {mode === "signin" ?
          <>New here? <button style={linkButtonStyle} onClick={() => setMode("signup")}>Sign Up</button></> :
          <>Already have an account? <button style={linkButtonStyle} onClick={() => setMode("signin")}>Sign In</button></>
        }
      </div>
    </div>
  );
}
const inputStyle = {
  fontSize: 15,
  width: "100%",
  padding: "9px 11px",
  margin: "8px 0",
  borderRadius: 7,
  border: "1px solid var(--border-color)",
  outline: "none"
};
const buttonStyle = {
  width: "100%",
  padding: "0.7em 0",
  background: "var(--button-bg)",
  color: "var(--button-text)",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  marginTop: 8,
  transition: "all 0.2s"
};
const linkButtonStyle = {
  color: "#1976d2", background: "none", border: "none", padding: 0, fontSize: 14, cursor: "pointer", textDecoration: "underline"
};
