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
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/profile/ProfilePage";

function AppWrapper() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false); // estado do tema
  const location = useLocation();
  const navigate = useNavigate();

  // Carrega usuário e tema ao iniciar
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));

    const savedTheme = localStorage.getItem("darkMode");
    setDarkMode(savedTheme === "true");
  }, []);

  // Aplica ou remove classe dark no root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Salva escolha no localStorage para persistir
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const hideNavbar = location.pathname === "/ProfilePage";

  return (
    <>
      {/* Botão toggle de tema */}
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 999 }}>
        <button onClick={() => setDarkMode(!darkMode)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
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
