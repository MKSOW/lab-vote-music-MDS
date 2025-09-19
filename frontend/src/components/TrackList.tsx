import { useEffect, useState } from "react";
import { getSessions } from "../api/api";

export default function TrackList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des sessions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Chargement des sessions...</p>;

  if (sessions.length === 0) {
    return <p>Aucune session trouvée.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📅 Emploi du temps</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th>Matière</th>
            <th>Professeur</th>
            <th>Salle</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.subject}</td>
              <td>{session.teacher}</td>
              <td>{session.room}</td>
              <td>{new Date(session.start).toLocaleTimeString()}</td>
              <td>{new Date(session.end).toLocaleTimeString()}</td>
              <td>
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  Choisir une musique
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
