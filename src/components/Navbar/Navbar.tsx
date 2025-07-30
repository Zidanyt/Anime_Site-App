import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.component.sass";
import Profile from "../Profile/Profile";

interface NavbarProps {
  user: { name: string };
  logout: () => void;
}

const Navbar = ({ user }: NavbarProps) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [tema, setTema] = useState("claro");
  const isMobile = () => window.innerWidth < 768;

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
        <button
          className="menu-toggle"
          onClick={() => {
            if (isMobile()) toggleMenu();
          }}
        >
          ☰
        </button>

        <div className="nav-links">
          <Link
            to="/"
            onClick={() => {
              if (isMobile()) toggleMenu();
            }}
          >
            Animes
          </Link>
          <Link
            to="/top10"
            onClick={() => {
              if (isMobile()) toggleMenu();
            }}
          >
            Top 10
          </Link>
          <Link
            to="/favoritos"
            onClick={() => {
              if (isMobile()) toggleMenu();
            }}
          >
            Favoritos
          </Link>
          <Link
            to="/novos"
            onClick={() => {
              if (isMobile()) toggleMenu();
            }}
          >
            Novos Animes
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="search-input">
            <input type="text" placeholder="Pesquisar" />
          </div>
          <button className="theme-toggle" onClick={alternarTema}>
            {tema === "claro" ? "🌙" : "☀️"}
          </button>
        </div>

        <Link to="/ProfilePage">
          <div className="navbar-profile">
            <Profile name={user.name} />
          </div>
        </Link>

      </nav>

      <div className={`side-menu ${menuAberto ? "ativo" : ""}`}>
        <button className="fechar" onClick={toggleMenu}>
          ×
        </button>
        <Link to="/" onClick={toggleMenu}>
          Animes
        </Link>
        <Link to="/top10" onClick={toggleMenu}>
          Top 10
        </Link>
        <Link to="/favoritos" onClick={toggleMenu}>
          Favoritos
        </Link>
        <Link to="/novos" onClick={toggleMenu}>
          Novos Animes
        </Link>
        <Link to="/ProfilePage" onClick={toggleMenu}>
          <div className="side-profile-mobile">
            <Profile name={user.name} />
          </div>
        </Link>
      </div>
      {menuAberto && <div className="overlay" onClick={toggleMenu} />}
    </>
  );
};

export default Navbar;
