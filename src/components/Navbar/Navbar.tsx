import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.component.sass";
import Profile from "../Profile/Profile";
import { useSearch } from "../../../SearchContext";

interface NavbarProps {
  user: {
    name: string;
    avatarUrl?: string | null;
  };
  logout: () => void;
}

const Navbar = ({ user }: NavbarProps) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [tema, setTema] = useState("claro");
  const isMobile = () => window.innerWidth < 768;
  const { setTermo } = useSearch();

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema") || "claro";
    setTema(temaSalvo);
    document.documentElement.classList.toggle("dark", temaSalvo === "escuro");
  }, []);

  const alternarTema = () => {
    const novoTema = tema === "claro" ? "escuro" : "claro";
    setTema(novoTema);
    document.documentElement.classList.toggle("dark", novoTema === "escuro");
    localStorage.setItem("tema", novoTema);
  };

  const toggleMenu = () => setMenuAberto(!menuAberto);

  return (
    <>
      <nav className="navbar">
        <button className="menu-toggle" onClick={() => isMobile() && toggleMenu()}>
          ☰
        </button>

        <div className="nav-links">
          <Link to="/" onClick={() => isMobile() && toggleMenu()}>Animes</Link>
          <Link to="/top10" onClick={() => isMobile() && toggleMenu()}>Top 10</Link>
          <Link to="/favoritos" onClick={() => isMobile() && toggleMenu()}>Favoritos</Link>
          <Link to="/novos" onClick={() => isMobile() && toggleMenu()}>Novos Animes</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Pesquisar"
            onChange={(e) => setTermo(e.target.value)}
          />
          <button className="theme-toggle" onClick={alternarTema}>
            {tema === "claro" ? "🌙" : "☀️"}
          </button>
        </div>

        <Link to="/ProfilePage">
          <div className="navbar-profile">
            <Profile name={user.name} avatarUrl={user.avatarUrl} />
          </div>
        </Link>
      </nav>

      <div className={`side-menu ${menuAberto ? "ativo" : ""}`}>
        <button className="fechar" onClick={toggleMenu}>×</button>
        <Link to="/" onClick={toggleMenu}>Animes</Link>
        <Link to="/top10" onClick={toggleMenu}>Top 10</Link>
        <Link to="/favoritos" onClick={toggleMenu}>Favoritos</Link>
        <Link to="/novos" onClick={toggleMenu}>Novos Animes</Link>
        <Link to="/ProfilePage" onClick={toggleMenu}>
          <div className="side-profile-mobile">
            <Profile name={user.name} avatarUrl={user.avatarUrl} />
          </div>
        </Link>
      </div>
      {menuAberto && <div className="overlay" onClick={toggleMenu} />}
    </>
  );
};

export default Navbar;
