import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/AuthProvider";

export default function LoginCallback() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await api.post(`/api/auth/login/${token}`);

        // ✅ Stocke le user et token
        login(res.data.user, res.data.token);

        // 🔀 Redirige systématiquement vers la page MyTracks
        navigate("/my-tracks", { replace: true });
      } catch (err) {
        console.error("❌ Erreur LoginCallback :", err);
        navigate("/login");
      }
    })();
  }, [token, login, navigate]);

  return <p className="text-center mt-10">🔑 Connexion en cours...</p>;
}
