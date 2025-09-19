import { PrismaClient } from "@prisma/client";
import { fetchSessions, parseSessions } from "../services/scraping.js";

const prisma = new PrismaClient();

export async function runScraper() {
  try {
    console.log("🔄 Nettoyage des anciennes sessions...");

    // Supprimer d'abord les votes liés aux sessions passées
    await prisma.vote.deleteMany({
      where: {
        session: {
          date: { lt: new Date() } // sessions dont la date < aujourd'hui
        }
      }
    });

    // Supprimer les tracks liés aux sessions passées
    await prisma.track.deleteMany({
      where: {
        session: {
          date: { lt: new Date() }
        }
      }
    });

    // Supprimer les sessions passées
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        date: { lt: new Date() }
      }
    });

    console.log(`✅ ${deletedSessions.count} anciennes sessions supprimées`);

    console.log("🔎 Récupération des données JSON...");
    const json = await fetchSessions();
    const sessions = parseSessions(json);

    console.log(`✅ ${sessions.length} sessions trouvées`);
    console.table(sessions, ["subject", "teacher", "room", "start", "end"]);

    for (const s of sessions) {
      await prisma.session.upsert({
        where: {
          subject_start_room: {
            subject: s.subject,
            start: s.start,
            room: s.room
          }
        },
        update: {
          teacher: s.teacher,
          audience: s.audience,
          date: s.date,
          end: s.end
        },
        create: {
          subject: s.subject,
          teacher: s.teacher,
          audience: s.audience,
          room: s.room,
          date: s.date,
          start: s.start,
          end: s.end
        }
      });
    }

    console.log("💾 Sessions insérées/mises à jour en base !");
  } catch (err) {
    console.error("❌ Erreur de scraping :", err);
  } finally {
    await prisma.$disconnect();
    console.log("✅ Scraping terminé");
  }
}
