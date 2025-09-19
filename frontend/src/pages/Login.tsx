import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLoginRequest() {
    try {
      const res = await api.post("/api/auth/request-login", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erreur lors de la connexion");
    }
  }

  // Si l'utilisateur est déjà connecté → rediriger vers l'accueil
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <input
        type="email"
        placeholder="Votre email"
        className="border p-2 rounded mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-64"
        onClick={handleLoginRequest}
        disabled={!email}
      >
        Recevoir le lien de connexion
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
