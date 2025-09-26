import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { runScraper } from "./jobs/scraper.js";
import authRoutes from "./routes/auth.js";
import tracksRoutes from "./routes/tracks.js";
import votesroutes from "./routes/votes.js";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/votes", votesroutes);

app.use("/api/tracks", tracksRoutes);
// --- Test route ---
app.get("/", (req, res) => {
  res.json({ message: "API OK 🚀" });
});

// --- Exemple: récupérer toutes les sessions ---
app.get("/sessions", async (req, res) => {
  const sessions = await prisma.session.findMany({
    include: { tracks: true, votes: true }
  });
  res.json(sessions);
});

// 🔥 Scraping au démarrage du serveur
(async () => {
  try {
    await runScraper();
  } catch (err) {
    console.error("❌ Erreur scraping initial :", err);
  }
})();

// 🕒 Planifier l'exécution quotidienne à 07h00 heure de Paris
cron.schedule(
  "0 7 * * *",
  async () => {
    console.log("⏰ Cron: lancement du scraping quotidien à 07h00...");
    await runScraper();
  },
  {
    timezone: "Europe/Paris", // ✅ pour que ce soit bien 07h heure locale
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
});
