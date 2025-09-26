import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuth } from "./hooks/AuthProvider";
import Navbar from "./components/Navbar";
import LoginCallback from "./pages/LoginCallback";
import MyTracks from "./pages/MyTracks";
import TrackForm from "./pages/TrackForm";
import Profile from "./pages/Profile";

function App() {
  const { user, initialized } = useAuth();
  const location = useLocation();

  // 🛠 Gérer la redirection après login
  if (location.state?.from && !user && initialized) {
    localStorage.setItem("redirectAfterLogin", location.state.from);
  }

  if (!initialized) {
    return <div className="text-center mt-10">⏳ Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar uniquement si user est connecté */}
      {user && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:token" element={<LoginCallback />} />

        {/* ✅ Route protégée pour Mes musiques */}
        <Route
          path="/my-tracks"
          element={
            user ? (
              <MyTracks />
            ) : (
              (() => {
                localStorage.setItem("redirectAfterLogin", "/my-tracks");
                return <Navigate to="/login" state={{ from: "/my-tracks" }} replace />;
              })()
            )
          }
        />

        {/* ✅ Route protégée pour Proposer une musique */}
        <Route
          path="/proposer"
          element={
            user ? (
              <TrackForm />
            ) : (
              (() => {
                localStorage.setItem("redirectAfterLogin", "/proposer");
                return <Navigate to="/login" state={{ from: "/proposer" }} replace />;
              })()
            )
          }
        />
        {/* ✅ Route protégée pour Profil */}
        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
            ) : (
              (() => {
                localStorage.setItem("redirectAfterLogin", "/profile");
                return <Navigate to="/login" state={{ from: "/profile" }} replace />;
              })()
            )
          }
        />

        {/* ✅ Redirige toutes les autres routes vers home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
