import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  // ⏳ Attend que l'auth ait fini de se charger
  if (!initialized) {
    return <p className="text-center mt-10">⏳ Vérification de l'authentification...</p>;
  }

  // 🚫 Si pas connecté → sauvegarde la route et redirige
  if (!user) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  // ✅ Sinon, rend la page
  return children;
}
