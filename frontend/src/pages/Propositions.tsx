import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Track {
  id: number;
  title: string;
  artist: string;
  sessionId: number;
  _count?: { votes: number }; // ✅ optionnel pour éviter les erreurs
}

export default function Propositions() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [canVoteMap, setCanVoteMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/propositions");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/tracks");

        // ✅ Tri sécurisé même si _count est absent
        const sortedTracks = res.data.sort(
          (a: Track, b: Track) =>
            (b._count?.votes ?? 0) - (a._count?.votes ?? 0)
        );
        setTracks(sortedTracks);

        const canVoteResults: Record<number, boolean> = {};
        await Promise.all(
          sortedTracks.map(async (t) => {
            try {
              const r = await api.get(`/api/votes/can-vote/${t.sessionId}`);
              canVoteResults[t.sessionId] = r.data.canVote;
            } catch {
              canVoteResults[t.sessionId] = false;
            }
          })
        );
        setCanVoteMap(canVoteResults);
      } catch (err) {
        console.error("❌ Erreur récupération tracks :", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, initialized, navigate]);

  if (!initialized) return <p className="text-center mt-10">⏳ Vérification de l'auth...</p>;
  if (loading) return <p className="text-center mt-10">⏳ Chargement des propositions...</p>;

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎶 Propositions de Musiques</h1>

      {tracks.length === 0 ? (
        <p className="text-gray-400">Aucune musique proposée pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 bg-black">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Titre</th>
                <th className="p-3 text-left">Artiste</th>
                <th className="p-3 text-center">Votes</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-900">
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.artist}</td>
                  <td className="p-3 text-center font-bold text-yellow-400">
                    {t._count?.votes ?? 0}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className={`px-4 py-2 rounded font-bold transition ${
                        canVoteMap[t.sessionId]
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => handleVote(t.id, t.sessionId)}
                      disabled={!canVoteMap[t.sessionId]}
                    >
                      👍 Voter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  async function handleVote(trackId: number, sessionId: number) {
    try {
      const res = await api.post("/api/votes", { trackId, sessionId });
      alert(res.data.message);

      setTracks((prev) =>
        prev.map((t) =>
          t.id === trackId ? { ...t, _count: { votes: res.data.totalVotes } } : t
        )
      );

      setCanVoteMap((prev) => ({ ...prev, [sessionId]: false }));
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur lors du vote");
    }
  }
}
