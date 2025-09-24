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

  // 🔄 Charger les sessions disponibles au montage
  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await api.get("/sessions"); // ✅ récupère toutes les sessions
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

      // ✅ Appel correct avec /api/tracks
      await api.post("/api/tracks", {
        title,
        artist,
        sessionId: Number(sessionId),
      });

      // ✅ Réinitialiser le formulaire
      setTitle("");
      setArtist("");
      setSessionId("");

      // ✅ Rediriger vers la page des propositions
      navigate("/propositions");
    } catch (err: any) {
      console.error("❌ Erreur TrackForm :", err);
      setError(err.response?.data?.error || "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">🎵 Proposer une musique</h1>

      {error && (
        <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Sélecteur de session */}
        <select
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="p-2 border rounded text-black"
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
          className="p-2 border rounded text-black"
          required
        />

        <input
          type="text"
          placeholder="Artiste"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />

        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-300 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "⏳ Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}
