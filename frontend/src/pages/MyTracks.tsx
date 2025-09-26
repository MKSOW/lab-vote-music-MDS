import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";

interface Track {
  id: number;
  title: string;
  artist: string;
  sessionId: number;
  user: { id: number; firstname: string; lastname: string };
  _count: { votes: number };
}

export default function MyTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [canVoteMap, setCanVoteMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/my-tracks");
      navigate("/login");
      return;
    }

    // ✅ Affiche un toast si passé en state (depuis TrackForm)
    if (location.state?.toast) {
      setToast(location.state.toast);
      setFadeOut(false);
      window.history.replaceState({}, document.title);
      setTimeout(() => setFadeOut(true), 2500);
      setTimeout(() => setToast(null), 3000);
    }

    (async () => {
      try {
        const res = await api.get<Track[]>("/api/tracks");
        const sortedTracks = res.data.sort(
          (a, b) => (b._count?.votes ?? 0) - (a._count?.votes ?? 0)
        );
        setTracks(sortedTracks);

        const results: Record<number, boolean> = {};
        await Promise.all(
          sortedTracks.map(async (t) => {
            try {
              const r = await api.get<{ canVote: boolean }>(
                `/api/votes/can-vote/${t.sessionId}`
              );
              results[t.sessionId] = r.data.canVote;
            } catch {
              results[t.sessionId] = false;
            }
          })
        );
        setCanVoteMap(results);
      } catch (err) {
        console.error("❌ Erreur récupération musiques :", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, initialized, navigate, location.state]);

  async function handleVote(trackId: number, sessionId: number) {
    try {
      const res = await api.post<{ message: string; totalVotes: number }>(
        "/api/votes",
        { trackId, sessionId }
      );

      showToast(res.data.message);

      setTracks((prev) =>
        prev.map((t) =>
          t.id === trackId ? { ...t, _count: { votes: res.data.totalVotes } } : t
        )
      );

      setCanVoteMap((prev) => ({ ...prev, [sessionId]: false }));
    } catch (err: any) {
      showToast(err.response?.data?.error || "Erreur lors du vote");
    }
  }

  async function handleDelete(trackId: number) {
    if (!window.confirm("❌ Supprimer cette proposition ?")) return;

    try {
      await api.delete(`/api/tracks/${trackId}`);
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      showToast("🗑️ Proposition supprimée avec succès !");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Erreur lors de la suppression");
    }
  }

  function showToast(message: string) {
    setToast(message);
    setFadeOut(false);
    setTimeout(() => setFadeOut(true), 2500);
    setTimeout(() => setToast(null), 3000);
  }

  if (!initialized)
    return <p className="text-center mt-10">⏳ Vérification de l'auth...</p>;
  if (loading)
    return <p className="text-center mt-10">⏳ Chargement des propositions...</p>;

  const hasProposed = tracks.some((t) => t.user.id === user?.id);

  return (
    <section className="page-section">
      {/* ✅ Toast */}
      {toast && (
        <div
          style={{
            background: "#22c55e",
            color: "#000",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "1rem",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 1s ease-out",
          }}
        >
          {toast}
        </div>
      )}

      <h1 className="page-title">🎶 Toutes les propositions</h1>

      {tracks.length === 0 ? (
        <p className="text-center" style={{ color: "#aaa" }}>
          Aucune musique proposée.
          {!hasProposed && (
            <button
              className="btn ml-2"
              onClick={() => navigate("/proposer")}
              style={{ marginLeft: "0.5rem" }}
            >
              ➕ Proposer une musique
            </button>
          )}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Artiste</th>
                <th>Proposé par</th>
                <th className="text-center">Votes</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => {
                const canVote = canVoteMap[t.sessionId];
                const isMyTrack = t.user.id === user?.id;

                return (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{t.artist}</td>
                    <td>{t.user.firstname} {t.user.lastname}</td>
                    <td
                      className="text-center"
                      style={{ color: "var(--accent)", fontWeight: "bold" }}
                    >
                      {t._count?.votes ?? 0}
                    </td>
                    <td className="text-center">
                      {isMyTrack ? (
                        <>
                          <span style={{ color: "#aaa", marginRight: "0.5rem" }}>🙅 Pas de vote</span>
                          <button
                            onClick={() => handleDelete(t.id)}
                            style={{
                              background: "#b91c1c",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </>
                      ) : canVote === undefined ? (
                        <span style={{ color: "#aaa" }}>⏳...</span>
                      ) : (
                        <button
                          className="btn"
                          onClick={() => handleVote(t.id, t.sessionId)}
                          disabled={!canVote}
                        >
                          👍 Voter
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!hasProposed && (
            <div className="text-center mt-4">
              <button className="btn" onClick={() => navigate("/proposer")}>
                ➕ Faire une proposition
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
