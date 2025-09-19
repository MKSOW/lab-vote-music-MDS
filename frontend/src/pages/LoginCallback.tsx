import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

export default function LoginCallback() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await api.post(`/api/auth/login/${token}`);
        // sauvegarde user + token dans localStorage
        if (token) {
            login(res.data.user, token);
            navigate("/");
            } else {
            console.error("Pas de token dans l'URL !");
            navigate("/login");
            }

        navigate("/"); // redirige vers Home
      } catch (err) {
        console.error("❌ Erreur de connexion avec le token :", err);
        navigate("/login"); // si token invalide → page login
      }
    }

    if (token) verifyToken();
  }, [token]);

  return <p className="text-center mt-10">🔑 Connexion en cours...</p>;
}
