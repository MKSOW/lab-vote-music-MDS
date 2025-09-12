import { Routes, Route, Navigate } from "react-router-dom";
import TrackList from "./components/TrackList";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      {/* Page de login */}
      <Route path="/login" element={<Login />} />

      {/* Page des morceaux */}
      <Route path="/tracks" element={<TrackList />} />

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
