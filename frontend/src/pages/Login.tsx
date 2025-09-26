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
      setMessage("");
      const res = await api.post("/api/auth/request-login", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section">
      <h1 className="page-title">🔑 Connexion</h1>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          padding: "1.5rem",
          maxWidth: "400px",
          margin: "0 auto",
          boxShadow: "0 0 10px rgba(0,0,0,0.6)",
        }}
      >
        <input
          type="email"
          placeholder="Votre email"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#fff",
            color: "#000",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleLoginRequest}
          className="btn"
          style={{ width: "100%", fontSize: "1rem" }}
          disabled={!email || loading}
        >
          {loading ? "⏳ Envoi..." : "Recevoir le lien de connexion"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: message.includes("Erreur") ? "#f87171" : "#fff",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
