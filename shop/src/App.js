import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import ShopPage from "./pages/ShopPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    fetch(`${API}/api/me`, {
      credentials: "include",
    })
      .then(r => r.json())
      .then(d => {
        setUser(d.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  async function signUp({ email, password, role }) {
    const r = await fetch(`${API}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, role }),
    });

    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Signup failed");

    // After successful signup, user is automatically logged in
    const meResponse = await fetch(`${API}/api/me`, { credentials: "include" });
    const meData = await meResponse.json();
    setUser(meData.user);
  }

  async function signIn({ email, password }) {
    const r = await fetch(`${API}/api/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Signin failed");

    // After successful signin, get user info
    const meResponse = await fetch(`${API}/api/me`, { credentials: "include" });
    const meData = await meResponse.json();
    setUser(meData.user);
  }

  async function signOut() {
    await fetch(`${API}/api/signout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  function RequireAuth({ user, children }) {
    if (!user) return <Navigate to="/signin" replace />;
    return children;
  }
  function RequireGuest({ user, children }) {
    if (user) return <Navigate to="/shop" replace />;
    return children;
  }

  return (

    <Routes>
      <Route path="/" element={<Navigate to="/shop" replace />} />

      <Route path="/signin"
        element={
          <RequireGuest user={user} >
            <SignInPage onSignIn={signIn} />
          </RequireGuest>
        } />
      <Route path="/signup" element={<RequireGuest user={user}> <SignUpPage onSignUp={signUp} /></RequireGuest>

      } />

      <Route path="/shop" element={
        <RequireAuth user={user}>
          <ShopPage user={user} onSignOut={signOut} />
        </RequireAuth>}
      />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>


  );



}



export default App;
