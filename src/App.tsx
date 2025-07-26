import "./styles/variables.sass";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Animes from "./pages/Animes";
import Top10 from "./pages/Top10";
import Favoritos from "./pages/Favoritos";
import NovosAnimes from "./pages/NovosAnimes";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ProfilePage from "./pages/profile/ProfilePage";

function AppWrapper() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Lê o tema salvo no carregamento inicial (evita piscar)
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Carrega usuário salvo (não tema, pois já foi feito no estado inicial acima)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  // Aplica ou remove classe .dark no root e salva no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const hideNavbar = location.pathname === "/ProfilePage";

  return (
    <>
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 999 }}>
        <button onClick={toggleTheme} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          {darkMode ? "🌞 Claro" : "🌙 Escuro"}
        </button>
      </div>

      {!hideNavbar && user && <Navbar user={user} logout={logout} />}

      {hideNavbar && (
        <div style={{ padding: "1rem" }}>
          <button onClick={() => navigate(-1)} style={{ fontSize: "1.5rem", cursor: "pointer" }}>
            ← Voltar
          </button>
        </div>
      )}

      <div style={{ paddingTop: !hideNavbar && user ? "80px" : 0 }}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register onRegister={setUser} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Animes /> : <Navigate to="/login" />} />
          <Route path="/top10" element={user ? <Top10 /> : <Navigate to="/login" />} />
          <Route path="/favoritos" element={user ? <Favoritos /> : <Navigate to="/login" />} />
          <Route path="/novos" element={user ? <NovosAnimes /> : <Navigate to="/login" />} />
          <Route path="/ProfilePage" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
