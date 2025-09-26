import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function TrackForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔄 Charger les sessions disponibles
  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await api.get("/sessions");
        setSessions(res.data);
      } catch (err: any) {
        console.error("❌ Erreur chargement sessions :", err);
        setError("Impossible de charger les sessions.");
      }
    }
    fetchSessions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionId) {
      setError("Veuillez sélectionner une session.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/tracks", {
        title,
        artist,
        sessionId: Number(sessionId),
      });

      // ✅ Redirige avec un toast de succès
      navigate("/my-tracks", {
        state: { toast: "✅ Votre musique a bien été proposée !" },
      });

      setTitle("");
      setArtist("");
      setSessionId("");
    } catch (err: any) {
      const message = err.response?.data?.error || "Erreur lors de l'envoi.";
      console.error("❌ Erreur TrackForm :", message);

      // ✅ Redirige vers MyTracks même en cas d’erreur si c’est une proposition déjà faite
      if (message.includes("déjà soumis") || message.includes("déjà proposé")) {
        navigate("/my-tracks", {
          state: { toast: "⚠️ Vous avez déjà proposé une musique pour cette session." },
        });
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section">
      <h1 className="page-title">🎵 Proposer une musique</h1>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.6)",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {error && (
          <p
            style={{
              backgroundColor: "#b91c1c",
              color: "#fff",
              padding: "0.5rem",
              borderRadius: "6px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Sélecteur de session */}
          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#fff",
              color: "#000",
              fontSize: "1rem",
            }}
            required
          >
            <option value="">Sélectionnez une session</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject} — Salle {s.room}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#fff",
              color: "#000",
              fontSize: "1rem",
            }}
            required
          />

          <input
            type="text"
            placeholder="Artiste"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#fff",
              color: "#000",
              fontSize: "1rem",
            }}
            required
          />

          <button
            type="submit"
            className="btn"
            style={{ width: "100%", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? "⏳ Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </section>
  );
}
