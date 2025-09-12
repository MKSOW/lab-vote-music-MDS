import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { runScraper } from "./jobs/scraper.js";
import authRoutes from "./routes/auth.js";
import tracksRoutes from "./routes/tracks.js";
import votesroutes from "./routes/votes.js"


const prisma = new PrismaClient();
const app = express();

// Planifier l'exécution tous les jours à 07h00
cron.schedule("0 7 * * *", async () => {
  console.log("⏰ Cron: lancement du scraping quotidien à 07h00...");
  await runScraper();
});


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tracks", tracksRoutes);
app.use("/api/votes", votesroutes);

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
