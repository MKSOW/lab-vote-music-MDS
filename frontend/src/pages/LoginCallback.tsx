import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

export default function LoginCallback() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        console.log("🌍 Appel API → POST /api/auth/login/:token ...");
        const res = await api.post(`/api/auth/login/${token}`);
        console.log("✅ Réponse API :", res.data);

        login(res.data.user, res.data.token);

        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");

        navigate(redirectTo, { replace: true });
      } catch (err) {
        console.error("❌ Erreur LoginCallback :", err);
        navigate("/login");
      }
    })();
  }, [token, login, navigate]);

  return <p className="text-center mt-10">🔑 Connexion en cours...</p>;
}
