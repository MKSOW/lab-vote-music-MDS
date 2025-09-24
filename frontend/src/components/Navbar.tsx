import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Emploi du temps" },
    { to: "/my-tracks", label: "Mes musiques" },
    { to: "/top-session", label: "Top Session" },
    { to: "/top-school", label: "Top École" },
    { to: "/profile", label: "Profil" },
    { to: "/propositions", label: "Propositions" },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
    setOpen(false);
  }

  function handleLogin() {
    navigate("/login");
    setOpen(false);
  }

  // 🔒 Bloquer le scroll quand menu ouvert
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  // ✅ Fermer le menu si l'écran repasse en mode desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 960) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`mv-nav ${open ? "is-menu-open" : ""}`}>
      <div className="mv-nav__container">
        {/* ---- Logo ---- */}
        <Link to="/" className="mv-nav__brand">
          <img src="/hyperplanning-logo.png" alt="HyperPlanning" />
        </Link>

        {/* ---- Menu Desktop ---- */}
        <nav className="mv-nav__menu">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`mv-nav__link${loc.pathname === l.to ? " is-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ---- Actions Droite ---- */}
        <div className="mv-nav__actions">
          {user ? (
            <button className="mv-nav__logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 17a1 1 0 0 0 1-1v-2h5a1 1 0 1 0 0-2h-5V10a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1zm1-15a5 5 0 0 1 5 5v1a1 1 0 1 1-2 0V7a3 3 0 1 0-6 0v10a3 3 0 0 0 6 0v-1a1 1 0 1 1 2 0v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/>
              </svg>
              <span>Déconnexion</span>
            </button>
          ) : (
            <button className="mv-nav__login" onClick={handleLogin}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 17a1 1 0 0 0 1-1v-2h5a1 1 0 1 0 0-2h-5V10a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1zm1-15a5 5 0 0 1 5 5v1a1 1 0 1 1-2 0V7a3 3 0 1 0-6 0v10a3 3 0 0 0 6 0v-1a1 1 0 1 1 2 0v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/>
              </svg>
              <span>Connexion</span>
            </button>
          )}

          {/* ---- Burger ---- */}
          <button
            className={`mv-nav__burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* ---- Menu Mobile ---- */}
      <nav className={`mv-nav__panel ${open ? "is-open" : ""}`}>
        <div className="mv-nav__panel-inner">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="mv-nav__panel-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
