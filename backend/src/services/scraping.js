import axios from "axios";
import { parse } from "date-fns";

export async function fetchSessions() {
  const url = "https://paris-02-2.hyperplanning.fr/hp/appelpanneauinformations";

  const body = {
    id: "PA3",
    init: true
  };

  const response = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0"
    }
  });

  return response.data;
}

export function parseSessions(data) {
  const sessions = [];

  if (!data || !data.listeCours) {
    console.warn("⚠️ Aucune session trouvée dans les données JSON");
    return sessions;
  }

  for (const c of data.listeCours) {
    // On reconstruit des Date complètes en utilisant l'heure fournie
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0]; // "2025-09-11"
    const startDate = parse(`${dateStr} ${c.deb}`, "yyyy-MM-dd HH'h'mm", new Date());
    const endDate = parse(`${dateStr} ${c.fin}`, "yyyy-MM-dd HH'h'mm", new Date());

    sessions.push({
      subject: c.mat ?? "N/A",
      teacher: c.prof?.length ? c.prof.join(", ") : null,
      audience: c.pub?.length ? c.pub.join(", ") : null,
      room: c.sal?.length ? c.sal.join(", ") : null,
      date: startDate,
      start: startDate,
      end: endDate
    });
  }

  return sessions;
}
