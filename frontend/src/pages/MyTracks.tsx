import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Track {
  id: number;
  title: string;
  artist: string;
  session: {
    subject: string;
    start: string;
    room: string | null;
  };
  _count: {
    votes: number;
  };
}

export default function MyTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return; // ✅ attend que l’auth soit vérifiée

    if (!user) {
      // 🛠 mémoriser la page pour y revenir après login
      localStorage.setItem("redirectAfterLogin", "/my-tracks");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await api.get("/api/tracks/my");
        setTracks(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération mes musiques :", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, initialized, navigate]);

  if (!initialized)
    return <p className="text-center mt-10">⏳ Vérification de l'auth...</p>;

  if (loading)
    return <p className="text-center mt-10">⏳ Chargement...</p>;

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎵 Mes musiques proposées</h1>

      {tracks.length === 0 ? (
        <p className="text-gray-400">
          Vous n'avez pas encore proposé de musique aujourd'hui.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 bg-black">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Titre</th>
                <th className="p-3 text-left">Artiste</th>
                <th className="p-3 text-left">Session</th>
                <th className="p-3 text-left">Salle</th>
                <th className="p-3 text-center">Votes</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-900">
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.artist}</td>
                  <td className="p-3">{t.session.subject}</td>
                  <td className="p-3">{t.session.room ?? "—"}</td>
                  <td className="p-3 text-center font-bold text-yellow-400">
                    {t._count.votes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
