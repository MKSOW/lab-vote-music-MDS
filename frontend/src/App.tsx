import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth"; 
import Navbar from "./components/Navbar";
import LoginCallback from "./pages/LoginCallback";
import MyTracks from "./pages/MyTracks";
import ProtectedRoute from "./components/ProtectedRoute";
import TopSession from "./pages/TopSession";
import TopSchool from "./pages/TopSchool";
import Profile from "./pages/Profile";
import TrackForm from "./pages/TrackForm";
import Propositions from "./pages/Propositions";

function App() {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return <div className="text-center mt-10">⏳ Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar s'affiche seulement si user est défini */}
      {user && location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:token" element={<LoginCallback />} />

        {/* ✅ Routes protégées */}
        <Route
          path="/my-tracks"
          element={
            <ProtectedRoute>
              <MyTracks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-session"
          element={
            <ProtectedRoute>
              <TopSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-school"
          element={
            <ProtectedRoute>
              <TopSchool />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracks/new"
          element={
            <ProtectedRoute>
              <TrackForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/propositions"
          element={
            <ProtectedRoute>
              <Propositions />
            </ProtectedRoute>
          }
        /> 

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
