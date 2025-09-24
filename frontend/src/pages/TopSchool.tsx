import { useEffect, useState } from "react";
import api from "../api/api";

interface Track {
  id: number;
  title: string;
  artist: string;
  _count: { votes: number };
  session: { subject: string; room: string | null };
}

export default function TopSchool() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/tracks/top");
        setTracks(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération top école :", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Chargement...</p>;

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">🏅 Top 5 de l'école</h1>

      {tracks.length === 0 ? (
        <p className="text-gray-400">Aucun vote enregistré aujourd'hui.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 bg-black">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Titre</th>
                <th className="p-3 text-left">Artiste</th>
                <th className="p-3 text-left">Matière</th>
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
