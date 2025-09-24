import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirige vers la page d'origine si déjà connecté
  useEffect(() => {
    if (user) {
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate]);

  async function handleLoginRequest() {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/request-login", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>

      <input
        type="email"
        placeholder="Votre email"
        className="border p-2 rounded mb-2 w-64 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded w-64 flex justify-center items-center ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleLoginRequest}
        disabled={!email || loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          "Recevoir le lien de connexion"
        )}
      </button>

      {message && <p className="mt-3 text-sm text-gray-300">{message}</p>}
    </div>
  );
}
