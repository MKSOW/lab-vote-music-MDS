import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth"; 
import Navbar from "./components/Navbar";
import LoginCallback from "./pages/LoginCallback";

/* import TracksPage from "./pages/TracksPage";
import TrackForm from "./components/TrackForm";
import TopSession from "./pages/TopSession";
import TopSchool from "./pages/TopSchool";
import Profile from "./pages/Profile";
*/

function App() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Afficher la navbar uniquement si connecté et pas sur /login */}
      {user && location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/login/:token" element={<LoginCallback />} />
          {/* <Route path="/tracks" element={<TracksPage />} />
        <Route path="/tracks/new" element={<TrackForm />} />
        <Route path="/top-session" element={<TopSession />} />
        <Route path="/top-school" element={<TopSchool />} />
        <Route path="/profile" element={<Profile />} />
         */}
      </Routes>
    </div>
  );
}

export default App;
