import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../hooks/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../styles/hyperplanning.css";

interface Session {
  id: number;
  subject: string;
  teacher: string | null;
  room: string | null;
  start: string;
  end: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/sessions");
        setSessions(res.data);
      } catch (e) {
        console.error("❌ Erreur récupération sessions :", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Chargement...</p>;

  return (
    <section className="p-4">
      <div className="hp rounded-lg overflow-hidden shadow">
        <table>
          <thead>
            <tr>
              <th>Horaires</th>
              <th>Salle</th>
              <th>Matière</th>
              <th>Enseignant</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Aucune session trouvée.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id}>
                  <td data-label="Horaires">
                    {new Date(s.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(s.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td data-label="Salle">{s.room ?? "—"}</td>
                  <td data-label="Matière">{s.subject}</td>
                  <td data-label="Enseignant">{s.teacher ?? "—"}</td>
                  <td data-label="Action">
                    {!user ? (
                      <button
                        className="btn-primary"
                        onClick={() => {
                          localStorage.setItem("sessionToVote", String(s.id));
                          localStorage.setItem("redirectAfterLogin", "/track-form");
                          navigate("/login");
                        }}
                      >
                        🎵 Choisir musique
                      </button>
                    ) : (
                      <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                        ✅ Connecté
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
