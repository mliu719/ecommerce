import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import ShopPage from "./pages/ShopPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

const USERS_KEY = "shop_users_v1";
const SESSION_KEY = "shop_session_v1";
function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;

  } catch {
    return fallback;
  }

}
function App() {
  const [users, setUsers] = useState(() => load(USERS_KEY, []));
  const [user, setUser] = useState(() => load(SESSION_KEY, null));

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function RequireAuth({ user, children }) {
    if (!user) return <Navigate to="/signin" replace />;
    return children;
  }

  function signUp({ email, password, role }) {
    const exists = users.some(u => u.email === email);
    if (exists) {
      throw new Error("Email already exists");
    }

    const newUser = { email, password, role };
    setUsers(prev => [...prev, newUser]);
    setUser({ email, role }); // log in immediately
  }
  function signIn({ email, password }) {
    const found = users.find(
      u => u.email === email && u.password === password
    );
    if (!found) {
      throw new Error("Wrong email or password");
    }
    setUser({ email: found.email, role: found.role });
  }
  function signOut() {
    setUser(null);
  }

  return (

    <Routes>
      <Route path="/" element={<Navigate to="/shop" replace />} />
      <Route path="/signin" element={<SignInPage onSignIn={signIn} />} />
      <Route path="/signup" element={<SignUpPage onSignUp={signUp} />} />

      <Route path="/shop" element={
        <RequireAuth user={user}>
          <ShopPage user={user} onSignOut={signOut} />
        </RequireAuth>}
      />
      <Route path="*" element={<Navigate to="/shop" replace />} />
    </Routes>


  );



}



export default App;