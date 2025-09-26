import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const loc = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Emploi du temps" },
    { to: "/my-tracks", label: "Musiques" },
    { to: "/proposer", label: "Formulaire" },
    { to: "/profile", label: "Profil" },
  ];

  // ✅ Déconnexion avec toast et délai avant suppression du user
 function handleLogout() {
  setToast({ message: "🔴 Vous êtes déconnecté", type: "error" });

  // ⏩ On redirige tout de suite pour éviter que /login ne s'affiche
  navigate("/");

  // ⏳ On attend 1,5 sec avant de supprimer le user (sinon Navbar disparaît trop tôt)
  setTimeout(() => {
    logout();
    setToast(null);
  }, 1500);

  setOpen(false);
}


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 960) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      setToast({ message: `👋 Bienvenue ${user.firstname || ""} !`, type: "success" });
      setTimeout(() => setToast(null), 2000);
    }
  }, [user]);

  return (
    <header className={`mv-nav ${open ? "is-menu-open" : ""}`}>
      {/* ✅ Toast dynamique */}
      {toast && (
        <div
          className="absolute top-2 right-2 px-4 py-2 rounded shadow-lg animate-fade-in z-50"
          style={{
            backgroundColor: toast.type === "error" ? "#dc2626" : "#22c55e",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="mv-nav__container">
        <Link to="/" className="mv-nav__brand">
          <img src="/hyperplanning-logo.png" alt="HyperPlanning" />
        </Link>

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

        <div className="mv-nav__actions">
          {user && (
            <button className="mv-nav__logout" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 17a1 1 0 0 0 1-1v-2h5a1 1 0 1 0 0-2h-5V10a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1zm1-15a5 5 0 0 1 5 5v1a1 1 0 1 1-2 0V7a3 3 0 1 0-6 0v10a3 3 0 0 0 6 0v-1a1 1 0 1 1 2 0v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/>
              </svg>
              <span>Déconnexion</span>
            </button>
          )}

          <button
            className={`mv-nav__burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

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
