import { useEffect } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import ShopPage from "./pages/ShopPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, signIn, signOut, signUp, updatePassword } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

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
            <SignInPage onSignIn={(payload) => dispatch(signIn(payload)).unwrap()} />
          </RequireGuest>
        } />
      <Route path="/signup" element={<RequireGuest user={user}> <SignUpPage onSignUp={(payload) => dispatch(signUp(payload)).unwrap()} /></RequireGuest>

      } />

      <Route path="/shop" element={<ShopPage user={user} onSignOut={() => dispatch(signOut())} />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/password" element={
        <RequireAuth user={user}>
          <UpdatePasswordPage onUpdatePassword={(payload) => dispatch(updatePassword(payload)).unwrap()} />
        </RequireAuth>}
      />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>


  );



}



export default App;
